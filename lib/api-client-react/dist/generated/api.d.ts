import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AssessmentInput, AssessmentResult, HealthStatus, ListProgramsParams, ListSchoolsParams, Program, ProgramInput, ProgramUpdate, RefreshSummary, SaveProgramInput, SaveSchoolInput, School, SchoolDetail, SchoolInput, SchoolUpdate, Stats, UserProfile, UserProfileUpdate } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all schools
 */
export declare const getListSchoolsUrl: (params?: ListSchoolsParams) => string;
export declare const listSchools: (params?: ListSchoolsParams, options?: RequestInit) => Promise<School[]>;
export declare const getListSchoolsQueryKey: (params?: ListSchoolsParams) => readonly ["/api/schools", ...ListSchoolsParams[]];
export declare const getListSchoolsQueryOptions: <TData = Awaited<ReturnType<typeof listSchools>>, TError = ErrorType<unknown>>(params?: ListSchoolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSchools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSchools>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSchoolsQueryResult = NonNullable<Awaited<ReturnType<typeof listSchools>>>;
export type ListSchoolsQueryError = ErrorType<unknown>;
/**
 * @summary List all schools
 */
export declare function useListSchools<TData = Awaited<ReturnType<typeof listSchools>>, TError = ErrorType<unknown>>(params?: ListSchoolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSchools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a school (admin)
 */
export declare const getCreateSchoolUrl: () => string;
export declare const createSchool: (schoolInput: SchoolInput, options?: RequestInit) => Promise<School>;
export declare const getCreateSchoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSchool>>, TError, {
        data: BodyType<SchoolInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSchool>>, TError, {
    data: BodyType<SchoolInput>;
}, TContext>;
export type CreateSchoolMutationResult = NonNullable<Awaited<ReturnType<typeof createSchool>>>;
export type CreateSchoolMutationBody = BodyType<SchoolInput>;
export type CreateSchoolMutationError = ErrorType<unknown>;
/**
 * @summary Create a school (admin)
 */
export declare const useCreateSchool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSchool>>, TError, {
        data: BodyType<SchoolInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSchool>>, TError, {
    data: BodyType<SchoolInput>;
}, TContext>;
/**
 * @summary Get school details
 */
export declare const getGetSchoolUrl: (id: number) => string;
export declare const getSchool: (id: number, options?: RequestInit) => Promise<SchoolDetail>;
export declare const getGetSchoolQueryKey: (id: number) => readonly [`/api/schools/${number}`];
export declare const getGetSchoolQueryOptions: <TData = Awaited<ReturnType<typeof getSchool>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSchool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSchool>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSchoolQueryResult = NonNullable<Awaited<ReturnType<typeof getSchool>>>;
export type GetSchoolQueryError = ErrorType<void>;
/**
 * @summary Get school details
 */
export declare function useGetSchool<TData = Awaited<ReturnType<typeof getSchool>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSchool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a school (admin)
 */
export declare const getUpdateSchoolUrl: (id: number) => string;
export declare const updateSchool: (id: number, schoolUpdate: SchoolUpdate, options?: RequestInit) => Promise<School>;
export declare const getUpdateSchoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSchool>>, TError, {
        id: number;
        data: BodyType<SchoolUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSchool>>, TError, {
    id: number;
    data: BodyType<SchoolUpdate>;
}, TContext>;
export type UpdateSchoolMutationResult = NonNullable<Awaited<ReturnType<typeof updateSchool>>>;
export type UpdateSchoolMutationBody = BodyType<SchoolUpdate>;
export type UpdateSchoolMutationError = ErrorType<unknown>;
/**
 * @summary Update a school (admin)
 */
export declare const useUpdateSchool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSchool>>, TError, {
        id: number;
        data: BodyType<SchoolUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSchool>>, TError, {
    id: number;
    data: BodyType<SchoolUpdate>;
}, TContext>;
/**
 * @summary Delete a school (admin)
 */
export declare const getDeleteSchoolUrl: (id: number) => string;
export declare const deleteSchool: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteSchoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSchool>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSchool>>, TError, {
    id: number;
}, TContext>;
export type DeleteSchoolMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSchool>>>;
export type DeleteSchoolMutationError = ErrorType<unknown>;
/**
 * @summary Delete a school (admin)
 */
export declare const useDeleteSchool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSchool>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSchool>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all programs
 */
export declare const getListProgramsUrl: (params?: ListProgramsParams) => string;
export declare const listPrograms: (params?: ListProgramsParams, options?: RequestInit) => Promise<Program[]>;
export declare const getListProgramsQueryKey: (params?: ListProgramsParams) => readonly ["/api/programs", ...ListProgramsParams[]];
export declare const getListProgramsQueryOptions: <TData = Awaited<ReturnType<typeof listPrograms>>, TError = ErrorType<unknown>>(params?: ListProgramsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPrograms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProgramsQueryResult = NonNullable<Awaited<ReturnType<typeof listPrograms>>>;
export type ListProgramsQueryError = ErrorType<unknown>;
/**
 * @summary List all programs
 */
export declare function useListPrograms<TData = Awaited<ReturnType<typeof listPrograms>>, TError = ErrorType<unknown>>(params?: ListProgramsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a program (admin)
 */
export declare const getCreateProgramUrl: () => string;
export declare const createProgram: (programInput: ProgramInput, options?: RequestInit) => Promise<Program>;
export declare const getCreateProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
        data: BodyType<ProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
    data: BodyType<ProgramInput>;
}, TContext>;
export type CreateProgramMutationResult = NonNullable<Awaited<ReturnType<typeof createProgram>>>;
export type CreateProgramMutationBody = BodyType<ProgramInput>;
export type CreateProgramMutationError = ErrorType<unknown>;
/**
 * @summary Create a program (admin)
 */
export declare const useCreateProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
        data: BodyType<ProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProgram>>, TError, {
    data: BodyType<ProgramInput>;
}, TContext>;
/**
 * @summary Get program details
 */
export declare const getGetProgramUrl: (id: number) => string;
export declare const getProgram: (id: number, options?: RequestInit) => Promise<Program>;
export declare const getGetProgramQueryKey: (id: number) => readonly [`/api/programs/${number}`];
export declare const getGetProgramQueryOptions: <TData = Awaited<ReturnType<typeof getProgram>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProgram>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProgram>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProgramQueryResult = NonNullable<Awaited<ReturnType<typeof getProgram>>>;
export type GetProgramQueryError = ErrorType<void>;
/**
 * @summary Get program details
 */
export declare function useGetProgram<TData = Awaited<ReturnType<typeof getProgram>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProgram>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a program (admin)
 */
export declare const getUpdateProgramUrl: (id: number) => string;
export declare const updateProgram: (id: number, programUpdate: ProgramUpdate, options?: RequestInit) => Promise<Program>;
export declare const getUpdateProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProgram>>, TError, {
        id: number;
        data: BodyType<ProgramUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProgram>>, TError, {
    id: number;
    data: BodyType<ProgramUpdate>;
}, TContext>;
export type UpdateProgramMutationResult = NonNullable<Awaited<ReturnType<typeof updateProgram>>>;
export type UpdateProgramMutationBody = BodyType<ProgramUpdate>;
export type UpdateProgramMutationError = ErrorType<unknown>;
/**
 * @summary Update a program (admin)
 */
export declare const useUpdateProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProgram>>, TError, {
        id: number;
        data: BodyType<ProgramUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProgram>>, TError, {
    id: number;
    data: BodyType<ProgramUpdate>;
}, TContext>;
/**
 * @summary Delete a program (admin)
 */
export declare const getDeleteProgramUrl: (id: number) => string;
export declare const deleteProgram: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProgram>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProgram>>, TError, {
    id: number;
}, TContext>;
export type DeleteProgramMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProgram>>>;
export type DeleteProgramMutationError = ErrorType<unknown>;
/**
 * @summary Delete a program (admin)
 */
export declare const useDeleteProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProgram>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteProgram>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get user's saved schools
 */
export declare const getGetSavedSchoolsUrl: () => string;
export declare const getSavedSchools: (options?: RequestInit) => Promise<School[]>;
export declare const getGetSavedSchoolsQueryKey: () => readonly ["/api/saved/schools"];
export declare const getGetSavedSchoolsQueryOptions: <TData = Awaited<ReturnType<typeof getSavedSchools>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSavedSchools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSavedSchools>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSavedSchoolsQueryResult = NonNullable<Awaited<ReturnType<typeof getSavedSchools>>>;
export type GetSavedSchoolsQueryError = ErrorType<unknown>;
/**
 * @summary Get user's saved schools
 */
export declare function useGetSavedSchools<TData = Awaited<ReturnType<typeof getSavedSchools>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSavedSchools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Save a school
 */
export declare const getSaveSchoolUrl: () => string;
export declare const saveSchool: (saveSchoolInput: SaveSchoolInput, options?: RequestInit) => Promise<void>;
export declare const getSaveSchoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveSchool>>, TError, {
        data: BodyType<SaveSchoolInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveSchool>>, TError, {
    data: BodyType<SaveSchoolInput>;
}, TContext>;
export type SaveSchoolMutationResult = NonNullable<Awaited<ReturnType<typeof saveSchool>>>;
export type SaveSchoolMutationBody = BodyType<SaveSchoolInput>;
export type SaveSchoolMutationError = ErrorType<unknown>;
/**
 * @summary Save a school
 */
export declare const useSaveSchool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveSchool>>, TError, {
        data: BodyType<SaveSchoolInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof saveSchool>>, TError, {
    data: BodyType<SaveSchoolInput>;
}, TContext>;
/**
 * @summary Remove saved school
 */
export declare const getUnsaveSchoolUrl: (schoolId: number) => string;
export declare const unsaveSchool: (schoolId: number, options?: RequestInit) => Promise<void>;
export declare const getUnsaveSchoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unsaveSchool>>, TError, {
        schoolId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unsaveSchool>>, TError, {
    schoolId: number;
}, TContext>;
export type UnsaveSchoolMutationResult = NonNullable<Awaited<ReturnType<typeof unsaveSchool>>>;
export type UnsaveSchoolMutationError = ErrorType<unknown>;
/**
 * @summary Remove saved school
 */
export declare const useUnsaveSchool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unsaveSchool>>, TError, {
        schoolId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unsaveSchool>>, TError, {
    schoolId: number;
}, TContext>;
/**
 * @summary Get user's saved programs
 */
export declare const getGetSavedProgramsUrl: () => string;
export declare const getSavedPrograms: (options?: RequestInit) => Promise<Program[]>;
export declare const getGetSavedProgramsQueryKey: () => readonly ["/api/saved/programs"];
export declare const getGetSavedProgramsQueryOptions: <TData = Awaited<ReturnType<typeof getSavedPrograms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSavedPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSavedPrograms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSavedProgramsQueryResult = NonNullable<Awaited<ReturnType<typeof getSavedPrograms>>>;
export type GetSavedProgramsQueryError = ErrorType<unknown>;
/**
 * @summary Get user's saved programs
 */
export declare function useGetSavedPrograms<TData = Awaited<ReturnType<typeof getSavedPrograms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSavedPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Save a program
 */
export declare const getSaveProgramUrl: () => string;
export declare const saveProgram: (saveProgramInput: SaveProgramInput, options?: RequestInit) => Promise<void>;
export declare const getSaveProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveProgram>>, TError, {
        data: BodyType<SaveProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveProgram>>, TError, {
    data: BodyType<SaveProgramInput>;
}, TContext>;
export type SaveProgramMutationResult = NonNullable<Awaited<ReturnType<typeof saveProgram>>>;
export type SaveProgramMutationBody = BodyType<SaveProgramInput>;
export type SaveProgramMutationError = ErrorType<unknown>;
/**
 * @summary Save a program
 */
export declare const useSaveProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveProgram>>, TError, {
        data: BodyType<SaveProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof saveProgram>>, TError, {
    data: BodyType<SaveProgramInput>;
}, TContext>;
/**
 * @summary Remove saved program
 */
export declare const getUnsaveProgramUrl: (programId: number) => string;
export declare const unsaveProgram: (programId: number, options?: RequestInit) => Promise<void>;
export declare const getUnsaveProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unsaveProgram>>, TError, {
        programId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unsaveProgram>>, TError, {
    programId: number;
}, TContext>;
export type UnsaveProgramMutationResult = NonNullable<Awaited<ReturnType<typeof unsaveProgram>>>;
export type UnsaveProgramMutationError = ErrorType<unknown>;
/**
 * @summary Remove saved program
 */
export declare const useUnsaveProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unsaveProgram>>, TError, {
        programId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unsaveProgram>>, TError, {
    programId: number;
}, TContext>;
/**
 * @summary Submit self-assessment answers
 */
export declare const getSubmitAssessmentUrl: () => string;
export declare const submitAssessment: (assessmentInput: AssessmentInput, options?: RequestInit) => Promise<AssessmentResult>;
export declare const getSubmitAssessmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitAssessment>>, TError, {
        data: BodyType<AssessmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitAssessment>>, TError, {
    data: BodyType<AssessmentInput>;
}, TContext>;
export type SubmitAssessmentMutationResult = NonNullable<Awaited<ReturnType<typeof submitAssessment>>>;
export type SubmitAssessmentMutationBody = BodyType<AssessmentInput>;
export type SubmitAssessmentMutationError = ErrorType<unknown>;
/**
 * @summary Submit self-assessment answers
 */
export declare const useSubmitAssessment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitAssessment>>, TError, {
        data: BodyType<AssessmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitAssessment>>, TError, {
    data: BodyType<AssessmentInput>;
}, TContext>;
/**
 * @summary Get latest assessment result for user
 */
export declare const getGetAssessmentResultUrl: () => string;
export declare const getAssessmentResult: (options?: RequestInit) => Promise<AssessmentResult>;
export declare const getGetAssessmentResultQueryKey: () => readonly ["/api/assessment"];
export declare const getGetAssessmentResultQueryOptions: <TData = Awaited<ReturnType<typeof getAssessmentResult>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAssessmentResult>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAssessmentResult>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAssessmentResultQueryResult = NonNullable<Awaited<ReturnType<typeof getAssessmentResult>>>;
export type GetAssessmentResultQueryError = ErrorType<void>;
/**
 * @summary Get latest assessment result for user
 */
export declare function useGetAssessmentResult<TData = Awaited<ReturnType<typeof getAssessmentResult>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAssessmentResult>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Refresh school information from official websites
 */
export declare const getRefreshSchoolsUrl: () => string;
export declare const refreshSchools: (options?: RequestInit) => Promise<RefreshSummary>;
export declare const getRefreshSchoolsMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshSchools>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof refreshSchools>>, TError, void, TContext>;
export type RefreshSchoolsMutationResult = NonNullable<Awaited<ReturnType<typeof refreshSchools>>>;
export type RefreshSchoolsMutationError = ErrorType<void>;
/**
 * @summary Refresh school information from official websites
 */
export declare const useRefreshSchools: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshSchools>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof refreshSchools>>, TError, void, TContext>;
/**
 * @summary Get platform stats
 */
export declare const getGetStatsUrl: () => string;
export declare const getStats: (options?: RequestInit) => Promise<Stats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get platform stats
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user profile
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<UserProfile>;
export declare const getGetMeQueryKey: () => readonly ["/api/users/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current user profile
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user profile
 */
export declare const getUpdateMeUrl: () => string;
export declare const updateMe: (userProfileUpdate: UserProfileUpdate, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateMeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UserProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UserProfileUpdate>;
}, TContext>;
export type UpdateMeMutationResult = NonNullable<Awaited<ReturnType<typeof updateMe>>>;
export type UpdateMeMutationBody = BodyType<UserProfileUpdate>;
export type UpdateMeMutationError = ErrorType<unknown>;
/**
 * @summary Update user profile
 */
export declare const useUpdateMe: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UserProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UserProfileUpdate>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map