export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const AUTH = {
    REGISTER_CHECK: '/register_check',
    REGISTER: '/register',
    LOGIN: '/authenticate',
    LOGOUT: '/logout',
    REFRESH: '/refresh'
};

export const PROFILE = {
    GET_BY_USERNAME: (username) => `/profile/${username}`,
    GET: '/profile',
    UPLOAD_IMAGE: '/upload_image',
    UPDATE: '/profile',
    EDUCATIONS: {
        CREATE: '/profile/educations',
        DELETE: (id) => `/profile/educations/${id}`
    },
    JOBS: {
        CREATE: '/profile/jobs',
        DELETE: (id) => `/profile/jobs/${id}`
    }
};

export const FORUMS = {
    GET_BY_USER: (username) => `/forums/user/${username}`,
    UNLIKE: (id) => `/forums/${id}/unlike`,
    LIKE: (id) => `/forums/${id}/like`,
    REPLY: (id) => `/forums/${id}/reply`,
    LIST: '/forums',
    DELETE: (id) => `/forums/${id}`,
};

export const ARTICLES = {
    LIST: '/articles',
    UPDATE: (id) => `/articles/${id}`,
    DELETE: (id) => `/articles/${id}`,
    SHOW: (id) => `/articles/${id}`,
    CREATE: '/articles'
};

export const LIKES = {
    LIST: '/likes'
};

export const SURVEYS = {
    GET: (id) => `/forms/${id}`
};

export const JOBS = {
    GET: (id) => `/jobs/${id}`
};
