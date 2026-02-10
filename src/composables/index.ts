/**
 * Composables 统一导出
 * @description 统一导出所有 Composables
 */

export { useQuery, useMutation } from './useRequest';
export type { UseQueryOptions, UseMutationOptions } from './useRequest';

export { useTableData } from './useTableData';
export type { ApiCallParamsContext, UseTableDataOptions, TableDataState } from './useTableData';

export { useFormData } from './useFormData';
export type { UseFormDataOptions, FormDataState } from './useFormData';

export { useIcon, getIcon } from './useIcon';

export { useAuthFlow } from './useAuthFlow';
export type { LoginCredentials, AuthFlowResult } from './useAuthFlow';

export { useLoading, useLocalLoading, startLoading, stopLoading, stopAllLoading, withLoading } from './useLoading';
export type { LoadingType, LoadingOptions, LocalLoadingState } from './useLoading';

export { useTabBar } from './useTabBar';
export type { UseTabBarOptions, UseTabBarReturn } from './useTabBar';

export { usePermission } from './usePermission';
export type { PermissionMode } from './usePermission';

export { useTableColumns } from './useTableColumns';
export type { UseTableColumnsOptions, UseTableColumnsReturn } from './useTableColumns';

export { useFullscreen, isFullscreen, fullscreenElement } from './useFullscreen';
export type { UseFullscreenReturn } from './useFullscreen';
