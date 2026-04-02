export const environment = {
  firebase: {
    apiKey: 'AIzaSyAiKeUWjP_QW60GVzsCHqOakPd_IbncuxY',
    authDomain: 'authentication-785fd.firebaseapp.com',
    databaseURL: 'https://authentication-785fd.firebaseio.com',
    projectId: 'authentication-785fd',
    storageBucket: 'authentication-785fd.firebasestorage.app',
    messagingSenderId: '1075520564177',
    appId: '1:1075520564177:web:120808765ddd8c64a70ef0',
  },
  syllabusApiBaseUrl: 'https://authentication-785fd.web.app',
  attendanceApiBaseUrl: 'https://user-attendance.nikhiljose47.workers.dev',
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: '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',
  },

  aiModels: {
    fast: 'meta-llama/llama-3.1-8b-instruct', // cheap
    theory: 'meta-llama/llama-3.1-8b-instruct',
    solving: 'qwen/qwen2.5-7b-instruct',
    smart: 'mistralai/mixtral-8x7b-instruct', // expensive
    images: '',
  },
};
