# Admin site for Project Contigo

Admin frontend for Contigo - a social pairing event that matches university students two by two based on interests, traits, and preferences.

## Admin APIs

_Admin endpoints run on env var `VITE_API_BASE_URL`_

### User Management

- `GET /api/admin/users?...` - Get paginated users overview
  - Query Params: (optional)
    - `page` (default: 1) - Page number
    - `limit` (default: 20, max: 100) - Items per page
    - `status` (default: null, accpetable: `unverified`|`verification_pending`|`verified`|`form_completed`|`matched`|`confirmed`) - Filter a specific status

  ```json
  {
    "data": [
      {
        "id": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee",
        "email": "test@mails.tsinghua.edu.cn",
        "status": "form_completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  }
  ```

- `GET /api/admin/user/{user_id}` - Get detailed user information

  ```json
  {
    "id": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee",
    "email": "test@mails.tsinghua.edu.cn",
    "status": "form_completed",
    "wechat_id": "examplewechatid",
    "grade": "undergraduate",
    "card_photo_uri": "/api/admin/card/91f4cf07-b2b4-4c05-a31e-9ed524c936ee.jpg",
    "created_at": [2025, 250, 3, 35, 40, 479291000, 0, 0, 0],
    "updated_at": [2025, 250, 3, 56, 32, 487637000, 0, 0, 0],
    "form": {
      "gender": "female",
      "familiar_tags": ["pc_fps", "spanish"],
      "aspirational_tags": ["soccer", "creative_games"],
      "recent_topics": "Recently I love Bitcoin",
      "self_traits": ["empathy", "explorer"],
      "ideal_traits": ["empathy", "explorer"],
      "physical_boundary": 3,
      "self_intro": "Hello world",
      "profile_photo_uri": "/api/admin/photo/91f4cf07-b2b4-4c05-a31e-9ed524c936ee.jpg"
    }
  }
  ```

- `POST /api/admin/verify-user` - Update user verification status
  - JSON request body: `email` or `user_id`, `status`
  - Response:

  ```json
  {
    "user_id": "2536f5b0-0f6c-401b-9f92-be95efe571ed",
    "email": "second@mails.tsinghua.edu.cn",
    "status": "verified",
    "grade": "graduate",
    "card_photo_filename": "2536f5b0-0f6c-401b-9f92-be95efe571ed.jpg"
  }
  ```

- `GET /api/admin/card/{filename}` - Get user student card photo
  - Returns `200 OK` with image

- `GET /api/admin/photo/{filename}` - Get user profile photo
  - Returns `200 OK` with image

### Analytics & Statistics

- `GET /api/admin/stats` - Get user and system statistics

  ```json
  {
    "total_users": 2,
    "males": 1,
    "females": 1,
    "unmatched_males": 1,
    "unmatched_females": 1
  }
  ```

- `GET /api/admin/tags` - Get tag usage statistics

  ```json
  [
    {
      "id": "sports",
      "name": "运动/户外活动",
      "desc": "各类运动",
      "is_matchable": true,
      "user_count": 0,
      "idf_score": null,
      "children": [
        {
          "id": "volleyball",
          "name": "排球🏐",
          "desc": null,
          "is_matchable": true,
          "user_count": 1,
          "idf_score": 0.6931471805599453,
          "children": null
        }
      ]
    }
  ]
  ```

### Matching Operations

- `POST /api/admin/update-previews` - Regenerate match previews
  - Response: `{"success": true, "message": "Match previews updated successfully"}`
- `POST /api/admin/trigger-match` - Manually execute final matching immediately (normally won't be used)
  - Response: `{"success": true, "message": "Final matching completed successfully", "matches_created": 0}`
- `GET /api/admin/matches?...` - View all final matches
  - Query Parameters: (optional)
    - `page` (default: 1) - Page number
    - `limit` (default: 20, max: 100) - Items per page
  - Response:

  ```json
  {
    "data": [
      {
        "id": "e5aaeda4-a552-4858-a007-0d2e348987dd",
        "user_a_id": "067c94a2-85a4-4efa-b6e0-d952176f3fbd",
        "user_a_email": "user34@mails.tsinghua.edu.cn",
        "user_b_id": "8afaf1d9-43e3-4614-b7cf-065b50eb1317",
        "user_b_email": "user43@mails.tsinghua.edu.cn",
        "score": 24.737618891240754
      },
      {
        "id": "2e6199c6-d6f6-4a6e-9772-5617324f1d59",
        "user_a_id": "25bff9d6-ae4d-4098-99c9-93d258a1b4fc",
        "user_a_email": "user2@mails.tsinghua.edu.cn",
        "user_b_id": "4c2330c7-4510-4b6f-9ccd-9db7614b15ad",
        "user_b_email": "user41@mails.tsinghua.edu.cn",
        "score": 17.7941106355937
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 2,
      "total": 27,
      "total_pages": 14
    }
  }
  ```

- `GET /api/admin/scheduled-matches` - View scheduled final matches
  - Response:

  ```json
  [
    {
      "id": "6234b8f4-01df-4ec7-b7b8-67dc328c216c",
      "scheduled_time": "2025-09-17T13:00:59Z",
      "status": "Completed",
      "created_at": "2025-09-17T12:41:55.612615Z",
      "executed_at": "2025-09-17T13:01:55.445273Z",
      "matches_created": 0,
      "error_message": null
    },
    {
      "id": "7ec36949-51a2-4352-812e-f9bec48877dc",
      "scheduled_time": "2025-09-18T20:00:00Z",
      "status": "Pending",
      "created_at": "2025-09-17T12:41:55.614084Z",
      "executed_at": null,
      "matches_created": null,
      "error_message": null
    }
  ]
  ```

- `POST /api/admin/scheduled-matches` - Schedule a final match
  - JSON request body: `{"scheduled_times": [{"scheduled_time": "2025-09-17T13:00:59Z"}]}`
  - 201 Created with Response:

  ```json
  [
    {
      "id": "6234b8f4-01df-4ec7-b7b8-67dc328c216c",
      "scheduled_time": "2025-09-17T13:00:59Z",
      "status": "Pending",
      "created_at": "2025-09-17T12:41:55.612615Z",
      "executed_at": null,
      "matches_created": null,
      "error_message": null
    }
  ]
  ```

- `DELETE /api/admin/scheduled-matches/{id}` - Cancel a scheduled final match
  - Returns 200 OK
