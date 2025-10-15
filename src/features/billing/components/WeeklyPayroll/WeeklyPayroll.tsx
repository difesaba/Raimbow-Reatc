import React, { useState, useEffect } from 'react';
import { Container, Stack, Alert, Snackbar } from '@mui/material';
import { PayrollHeader } from '../PayrollHeader';
import { PayrollTable } from '../PayrollTable';
import { PayrollDetailModal } from '../PayrollDetailModal';
import type {
  PayrollWeekRange
} from '../../interfaces/payroll.interfaces';
import { usePayroll } from '../../hooks/usePayroll';

/**
 * Main weekly payroll component with real API integration
 * Uses usePayroll hook for data fetching and state management
 */
export const WeeklyPayroll: React.FC = () => {
  // ========== LOCAL UI STATE ==========
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  // ========== PAYROLL DATA HOOK ==========
  const {
    // Weekly data
    employees,
    weekRange,
    summary,
    setWeekRange,
    loading,
    error,
 

    // Employee details
    details,
    detailsLoading,
    detailsError,
    fetchDetails,
    clearDetails,

    // Export functionality
    exporting,
    exportError,
    generateStatement
  } = usePayroll();

  // ========== ERROR HANDLING ==========
  // Show snackbar when there's an error
  useEffect(() => {
    if (error || detailsError || exportError) {
      setErrorSnackbarOpen(true);
    }
  }, [error, detailsError, exportError]);

  // ========== EVENT HANDLERS ==========

  /**
   * Handle viewing employee details
   */
  const handleViewDetail = async (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setDrawerOpen(true);
    // Fetch employee details from API
    await fetchDetails(employeeId, weekRange);
  };

  /**
   * Handle closing the detail drawer
   */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    // Clear details after animation
    setTimeout(() => {
      setSelectedEmployeeId(null);
      clearDetails();
    }, 300);
  };

  /**
   * Handle date range change
   */
  const handleDateRangeChange = (newRange: PayrollWeekRange) => {
    setWeekRange(newRange);
    // usePayroll hook will automatically refetch data
  };

  /**
   * Handle downloading employee statement
   */
  const handleDownloadStatement = async (employeeId: number) => {
    const success = await generateStatement(employeeId, weekRange);
    if (!success) {
      setErrorSnackbarOpen(true);
    }
  };

  /**
   * Handle closing error snackbar
   */
  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  // ========== ERROR MESSAGE ==========
  const errorMessage = error?.message || detailsError?.message || exportError?.message || 'Error desconocido';

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, sm: 3, md: 4 } // Responsive horizontal padding
      }}
    >
      <Stack spacing={{ xs: 2, sm: 3 }}>
        {/* Header with summary metrics */}
        <PayrollHeader
          weekRange={weekRange}
          summary={summary}
          onDateRangeChange={handleDateRangeChange}
          loading={loading}
        />

        {/* Main payroll table */}
        <PayrollTable
          employees={employees}
          onViewDetail={handleViewDetail}
          onDownloadStatement={handleDownloadStatement}
          selectedEmployeeId={selectedEmployeeId || undefined}
          loading={loading}
          downloading={exporting}
        />

        {/* Detail modal */}
        <PayrollDetailModal
          open={drawerOpen}
          onClose={handleCloseDrawer}
          employeeDetails={details}
          loading={detailsLoading}
        />

        {/* Error notification */}
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseErrorSnackbar}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

