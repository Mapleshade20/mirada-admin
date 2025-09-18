import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { adminActions } from "../dataProvider";

interface Tag {
  id: string;
  name: string;
  desc: string;
  is_matchable: boolean;
  user_count: number;
  idf_score: number | null;
  children?: Tag[];
}

const TagRow = ({ tag, level = 0 }: { tag: Tag; level?: number }) => (
  <TableRow>
    <TableCell sx={{ pl: level * 3 + 1 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="body2"
          fontWeight={level === 0 ? "bold" : "normal"}
        >
          {tag.name}
        </Typography>
        {tag.is_matchable && (
          <Chip label="Matchable" size="small" color="primary" />
        )}
      </Box>
      {tag.desc && (
        <Typography variant="caption" color="text.secondary">
          {tag.desc}
        </Typography>
      )}
    </TableCell>
    <TableCell align="right">{tag.user_count}</TableCell>
    <TableCell align="right">
      {tag.idf_score ? tag.idf_score.toFixed(4) : "N/A"}
    </TableCell>
  </TableRow>
);

const TagsTable = ({ tags }: { tags: Tag[] }) => {
  const renderTags = (tagList: Tag[], level = 0): React.ReactNode[] => {
    return tagList.flatMap((tag) => [
      <TagRow key={tag.id} tag={tag} level={level} />,
      ...(tag.children ? renderTags(tag.children, level + 1) : []),
    ]);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tag Name</TableCell>
            <TableCell align="right">User Count</TableCell>
            <TableCell align="right">IDF Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTags(tags)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export const TagsAnalytics = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const data = await adminActions.getTags();
        setTags(data);
        setError(null);
      } catch (err) {
        setError("Failed to load tag analytics");
        console.error("Error fetching tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const totalTags = tags.reduce((acc, tag) => {
    return acc + 1 + (tag.children ? tag.children.length : 0);
  }, 0);

  const totalUsage = tags.reduce((acc, tag) => {
    const childrenUsage =
      tag.children?.reduce(
        (childAcc, child) => childAcc + child.user_count,
        0,
      ) || 0;
    return acc + tag.user_count + childrenUsage;
  }, 0);

  const matchableTags = tags.filter(
    (tag) =>
      tag.is_matchable || tag.children?.some((child) => child.is_matchable),
  ).length;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tag Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Analysis of tag usage and matching preferences
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {totalTags}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tags
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="secondary">
              {matchableTags}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matchable Categories
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main">
              {totalUsage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tag Usage
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tag Categories */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tag Categories & Usage
          </Typography>
          <Box sx={{ mt: 2 }}>
            {tags.map((category) => (
              <Accordion key={category.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {category.name}
                    </Typography>
                    {category.is_matchable && (
                      <Chip label="Matchable" size="small" color="primary" />
                    )}
                    <Box sx={{ ml: "auto" }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.children?.length || 0} subcategories
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {category.desc && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {category.desc}
                    </Typography>
                  )}
                  {category.children && category.children.length > 0 ? (
                    <TagsTable tags={category.children} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No subcategories available
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
