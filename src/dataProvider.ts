import queryString from "query-string";
import { type DataProvider, fetchUtils } from "react-admin";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8091";

const httpClient = (url: string, options: Record<string, unknown> = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  return fetchUtils.fetchJson(url, options);
};

// Helper function to convert Contigo timestamp array to Date
const parseTimestamp = (timestamp: number[]): string => {
  if (!Array.isArray(timestamp) || timestamp.length < 6) {
    return new Date().toISOString();
  }
  // Format: [year, day_of_year, hour, minute, second, nanosecond, ...]
  const [year, dayOfYear, hour, minute, second, nanosecond] = timestamp;
  const date = new Date(
    year,
    0,
    dayOfYear,
    hour,
    minute,
    second,
    Math.floor(nanosecond / 1000000),
  );
  return date.toISOString();
};

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    // const { field: _field, order: _order } = params.sort;
    const query: Record<string, unknown> = {
      page,
      limit: perPage,
    };

    if (params.filter) {
      Object.keys(params.filter).forEach((key) => {
        if (params.filter[key]) {
          query[key] = params.filter[key];
        }
      });
    }

    let url = "";

    switch (resource) {
      case "users":
        url = `${apiUrl}/api/admin/users?${queryString.stringify(query)}`;
        break;
      case "matches":
        url = `${apiUrl}/api/admin/matches?${queryString.stringify(query)}`;
        break;
      case "scheduled-matches":
        url = `${apiUrl}/api/admin/scheduled-matches`;
        return httpClient(url).then(({ json }) => ({
          data: json.map((item: Record<string, unknown>) => ({
            ...item,
            scheduled_time: new Date(item.scheduled_time).toISOString(),
            created_at: new Date(item.created_at).toISOString(),
            executed_at: item.executed_at
              ? new Date(item.executed_at).toISOString()
              : null,
          })),
          total: json.length,
        }));
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    return httpClient(url).then(({ json }) => {
      if (resource === "users") {
        return {
          data: json.data.map((user: Record<string, unknown>) => ({
            ...user,
            created_at: parseTimestamp(user.created_at),
            updated_at: parseTimestamp(user.updated_at),
          })),
          total: json.pagination.total,
        };
      }

      if (resource === "matches") {
        return {
          data: json.data,
          total: json.pagination.total,
        };
      }

      return { data: json, total: json.length };
    });
  },

  getOne: (resource, params) => {
    let url = "";
    const _body: Record<string, unknown> = {};

    switch (resource) {
      case "users":
        url = `${apiUrl}/api/admin/user/${params.id}`;
        return httpClient(url, {
          method: "GET",
          headers: new Headers({ "Content-Type": "application/json" }),
        }).then(({ json }) => ({
          data: {
            ...json,
            created_at: parseTimestamp(json.created_at),
            updated_at: parseTimestamp(json.updated_at),
          },
        }));
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  getMany: (resource, params) => {
    const promises = params.ids.map((id) => this.getOne?.(resource, { id }));
    return Promise.all(promises).then((responses) => ({
      data: responses.map((response) => response.data),
    }));
  },

  getManyReference: (resource, params) => {
    return this.getList?.(resource, {
      ...params,
      filter: { ...params.filter, [params.target]: params.id },
    });
  },

  create: (resource, params) => {
    let url = "";
    let body = params.data;

    switch (resource) {
      case "scheduled-matches":
        url = `${apiUrl}/api/admin/scheduled-matches`;
        body = {
          scheduled_times: [{ scheduled_time: params.data.scheduled_time }],
        };
        return httpClient(url, {
          method: "POST",
          body: JSON.stringify(body),
          headers: new Headers({ "Content-Type": "application/json" }),
        }).then(({ json }) => ({
          data: {
            ...json[0],
            scheduled_time: new Date(json[0].scheduled_time).toISOString(),
            created_at: new Date(json[0].created_at).toISOString(),
          },
        }));
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  update: (resource, params) => {
    let url = "";
    let body: Record<string, unknown> = {};

    switch (resource) {
      case "users":
        url = `${apiUrl}/api/admin/verify-user`;
        body = {
          user_id: params.id,
          status: params.data.status,
        };
        return httpClient(url, {
          method: "POST",
          body: JSON.stringify(body),
          headers: new Headers({ "Content-Type": "application/json" }),
        }).then(({ json }) => ({ data: { ...json, id: json.user_id } }));
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  updateMany: (resource, params) => {
    const promises = params.ids.map((id) =>
      this.update?.(resource, { id, data: params.data, previousData: {} }),
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },

  delete: (resource, params) => {
    let url = "";

    switch (resource) {
      case "scheduled-matches":
        url = `${apiUrl}/api/admin/scheduled-matches/${params.id}`;
        return httpClient(url, { method: "DELETE" }).then(() => ({
          data: params.previousData,
        }));
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  },

  deleteMany: (resource, params) => {
    const promises = params.ids.map((id) =>
      this.delete?.(resource, { id, previousData: {} }),
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },
};

// Custom methods for specific admin operations
export const adminActions = {
  getStats: () => {
    return httpClient(`${apiUrl}/api/admin/stats`).then(({ json }) => json);
  },

  getTags: () => {
    return httpClient(`${apiUrl}/api/admin/tags`).then(({ json }) => json);
  },

  updatePreviews: () => {
    return httpClient(`${apiUrl}/api/admin/update-previews`, {
      method: "POST",
    }).then(({ json }) => json);
  },

  triggerMatch: () => {
    return httpClient(`${apiUrl}/api/admin/trigger-match`, {
      method: "POST",
    }).then(({ json }) => json);
  },

  getCardImage: (filename: string) => {
    return `${apiUrl}/api/admin/card/${filename}`;
  },
};
