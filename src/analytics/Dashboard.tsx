import {
  Female,
  Male,
  People,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { adminActions } from "../dataProvider";

interface Stats {
  total_users: number;
  males: number;
  females: number;
  unmatched_males: number;
  unmatched_females: number;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminActions.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  if (!stats) {
    return (
      <Box p={2}>
        <Alert severity="info">No statistics available</Alert>
      </Box>
    );
  }

  const matchedMales = stats.males - stats.unmatched_males;
  const matchedFemales = stats.females - stats.unmatched_females;
  const totalMatched = matchedMales + matchedFemales;
  const totalUnmatched = stats.unmatched_males + stats.unmatched_females;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Overview of user statistics and matching progress
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.total_users}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Male Users"
            value={stats.males}
            icon={<Male fontSize="large" />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Female Users"
            value={stats.females}
            icon={<Female fontSize="large" />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Matched"
            value={totalMatched}
            icon={<PersonAdd fontSize="large" />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Unmatched Males"
            value={stats.unmatched_males}
            icon={<PersonRemove fontSize="large" />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Unmatched Females"
            value={stats.unmatched_females}
            icon={<PersonRemove fontSize="large" />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gender Distribution
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Male color="primary" />
                <Typography variant="body2">
                  Males: {stats.males} (
                  {((stats.males / stats.total_users) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Female color="secondary" />
                <Typography variant="body2">
                  Females: {stats.females} (
                  {((stats.females / stats.total_users) * 100).toFixed(1)}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Matching Progress
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <PersonAdd color="success" />
                <Typography variant="body2">
                  Matched: {totalMatched} (
                  {((totalMatched / stats.total_users) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <PersonRemove color="warning" />
                <Typography variant="body2">
                  Unmatched: {totalUnmatched} (
                  {((totalUnmatched / stats.total_users) * 100).toFixed(1)}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
