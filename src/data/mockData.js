// Mock and default data for AI-Powered Portfolio Compiler and Employability Assessment System

export const TARGET_ROLES = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: 'Brain',
    description: 'Statistical modeling, machine learning, data pipelines, predictive analytics',
    requiredSkills: {
      'Python Skills': 90,
      'Machine Learning': 88,
      'Deep Learning': 75,
      'SQL & Data Wrangling': 85,
      'Statistics & Math': 92,
      'MLOps & Cloud': 70,
    },
    suggestedMissingSkills: [
      { name: 'Python for Data Science', level: 'Advanced', category: 'Core Language', priority: 'High', reason: 'Vectorized NumPy & Pandas profiling needed' },
      { name: 'Machine Learning Pipelines', level: 'Intermediate', category: 'Model Training', priority: 'Critical', reason: 'Feature engineering & scikit-learn ensemble methods' },
      { name: 'Deep Learning & PyTorch', level: 'Intermediate', category: 'Neural Networks', priority: 'Medium', reason: 'Transfer learning on unstructured data' },
      { name: 'Model Deployment (Docker/FastAPI)', level: 'Beginner to Intermediate', category: 'Production', priority: 'High', reason: 'Target role requires API endpoints for model inference' },
    ],
    interviewQuestions: [
      {
        id: 1,
        question: "How do you detect and handle multicollinearity among features in high-dimensional regression models?",
        expectedKeywords: ['vif', 'variance inflation factor', 'correlation matrix', 'pca', 'ridge', 'lasso', 'regularization', 'feature selection'],
        sampleGoodAnswer: "I inspect pairwise correlation matrices and calculate Variance Inflation Factor (VIF). Values above 5 or 10 indicate problematic collinearity. To mitigate it, I either drop redundant features, apply PCA for dimensionality reduction, or use L1/L2 regularization (Ridge or Lasso) to penalize coefficient magnitudes.",
      },
      {
        id: 2,
        question: "Explain the tradeoff between precision and recall when tuning a classification model for fraud detection.",
        expectedKeywords: ['precision', 'recall', 'false positives', 'false negatives', 'f1 score', 'threshold', 'pr-auc', 'cost function'],
        sampleGoodAnswer: "In fraud detection, false negatives are significantly more costly than false positives. We prioritize high recall to catch fraudulent transactions, accepting some false positives for manual audit. We evaluate using PR-AUC and tune decision thresholds based on financial loss matrices.",
      },
      {
        id: 3,
        question: "What steps would you take to prevent data leakage during time-series or cross-validation training?",
        expectedKeywords: ['time-series split', 'rolling window', 'leakage', 'target encoding', 'pre-processing within fold', 'lookahead bias'],
        sampleGoodAnswer: "I strictly avoid standard k-fold on temporal data and instead use TimeSeriesSplit or rolling forward windows. All scaling, imputation, and target encodings are computed exclusively inside the training fold to prevent lookahead bias.",
      }
    ],
    quizQuestions: [
      {
        id: 'q1',
        category: 'Machine Learning',
        difficulty: 'Easy',
        question: "Which evaluation metric is most sensitive to class imbalance in classification?",
        options: ["Accuracy", "ROC-AUC", "PR-AUC (Precision-Recall)", "Mean Absolute Error"],
        correctIndex: 2,
        explanation: "PR-AUC focuses specifically on the minority positive class without being inflated by a large number of true negatives."
      },
      {
        id: 'q2',
        category: 'Python Skills',
        difficulty: 'Medium',
        question: "In Pandas, what is the memory-efficient way to filter a DataFrame of 10 million rows by multiple boolean conditions?",
        options: [
          "Iterating with .iterrows()",
          "Vectorized boolean indexing with .query() or bitwise operators (&, |)",
          "Converting the DataFrame into a Python dictionary",
          "Applying a custom lambda with .apply(axis=1)"
        ],
        correctIndex: 1,
        explanation: "Vectorized boolean masks run in native C code and leverage SIMD parallelism, avoiding slow Python per-row overhead."
      },
      {
        id: 'q3',
        category: 'Statistics & Math',
        difficulty: 'Medium',
        question: "What does a Variance Inflation Factor (VIF) value of 12 for an independent variable indicate?",
        options: [
          "The feature is completely independent of other features",
          "Severe multicollinearity is present and inflating coefficient variance",
          "The regression model has 12% residual error",
          "The feature is non-linear and requires log-transformation"
        ],
        correctIndex: 1,
        explanation: "VIF > 5-10 indicates high multicollinearity, meaning the variable is heavily explained by linear combinations of other predictors."
      },
      {
        id: 'q4',
        category: 'Deep Learning',
        difficulty: 'Hard',
        question: "Why is Batch Normalization typically placed before or immediately after non-linear activation in deep networks?",
        options: [
          "To reduce training memory to zero",
          "To stabilize internal covariate shift and smooth the optimization landscape",
          "To force all gradients to remain exactly 1.0",
          "To eliminate the need for backpropagation"
        ],
        correctIndex: 1,
        explanation: "Batch Normalization stabilizes layer inputs across mini-batches, smoothing loss gradients and enabling higher learning rates."
      },
      {
        id: 'q5',
        category: 'MLOps & Cloud',
        difficulty: 'Hard',
        question: "How do you detect Concept Drift in a production machine learning service?",
        options: [
          "By monitoring the CPU usage of the inference pod",
          "By measuring divergence in input feature distributions (e.g., PSI, KS-test) and degradation in ground truth metrics over time",
          "By checking if the model weights file changed hash",
          "By restarting the Docker container every 24 hours"
        ],
        correctIndex: 1,
        explanation: "Population Stability Index (PSI) and Kolmogorov-Smirnov tests detect data drift, while tracking ground truth labels detects true concept drift."
      }
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Web Developer',
    icon: 'Layers',
    description: 'Modern frontends, microservices, relational/NoSQL datastores, REST & GraphQL APIs',
    requiredSkills: {
      'Frontend (React/Next.js)': 90,
      'Backend (Node/Python)': 88,
      'Database & SQL': 82,
      'System Architecture': 80,
      'Testing & CI/CD': 75,
      'Cloud Deployment': 72,
    },
    suggestedMissingSkills: [
      { name: 'Server-Side Rendering & Caching', level: 'Intermediate', category: 'Frontend', priority: 'High', reason: 'Next.js App router and stale-while-revalidate patterns' },
      { name: 'Distributed Caching (Redis)', level: 'Intermediate', category: 'Backend', priority: 'Critical', reason: 'Session clustering and API rate-limiting' },
      { name: 'Docker & Containerization', level: 'Beginner to Intermediate', category: 'DevOps', priority: 'High', reason: 'Multi-stage builds and docker-compose setups' },
    ],
    interviewQuestions: [
      {
        id: 1,
        question: "How do you optimize Core Web Vitals (specifically Largest Contentful Paint and Cumulative Layout Shift) in a React application?",
        expectedKeywords: ['lcp', 'cls', 'image sizing', 'aspect-ratio', 'ssr', 'lazy loading', 'critical css', 'font-display', 'skeleton'],
        sampleGoodAnswer: "For LCP, I preload the hero asset with fetchpriority='high', use modern formats like WebP/AVIF, and ensure fast server response times with edge caching. For CLS, I set explicit width/height or aspect-ratio on all images and embeds and use skeleton placeholders for asynchronous dynamic data.",
      },
      {
        id: 2,
        question: "Describe your approach to designing a secure, fault-tolerant user authentication and session management system.",
        expectedKeywords: ['jwt', 'refresh token', 'httponly cookie', 'csrf', 'rate limiting', 'argon2', 'oauth2', 'rotation'],
        sampleGoodAnswer: "I use short-lived access tokens stored in memory paired with HttpOnly, Secure, SameSite refresh tokens stored in cookies. Refresh tokens are rotated upon each use and revocable in Redis. Passwords are hash-salted using Argon2id with brute-force rate-limiting.",
      }
    ],
    quizQuestions: [
      {
        id: 'q1',
        category: 'Frontend',
        difficulty: 'Easy',
        question: "What is the primary benefit of React Server Components (RSC)?",
        options: [
          "They eliminate the need for JavaScript in the browser entirely",
          "They execute exclusively on the server, sending zero client bundle size for component code while enabling direct database access",
          "They make state management redundant in React",
          "They replace CSS animations with WebAssembly"
        ],
        correctIndex: 1,
        explanation: "RSC renders on the server and streams pure UI tree JSON to the client, keeping heavy backend dependencies out of the browser bundle."
      },
      {
        id: 'q2',
        category: 'Backend',
        difficulty: 'Medium',
        question: "How does the Node.js Event Loop handle an incoming I/O operation?",
        options: [
          "It spawns a new OS thread for each operation synchronously",
          "It offloads asynchronous I/O to libuv threadpool or OS kernel and executes callbacks on the poll phase",
          "It pauses execution of all other requests until disk I/O completes",
          "It delegates I/O directly to V8 engine memory garbage collector"
        ],
        correctIndex: 1,
        explanation: "Node.js is single-threaded event loop driven, offloading non-blocking I/O to libuv and OS asynchronous notification mechanisms."
      },
      {
        id: 'q3',
        category: 'Database & SQL',
        difficulty: 'Hard',
        question: "When should you prefer a composite index over multiple single-column B-Tree indexes?",
        options: [
          "Only when tables have fewer than 10 rows",
          "When queries frequently filter or sort by multiple columns together following the leftmost prefix rule",
          "Whenever you want to save maximum disk space",
          "Never, single column indexes are always faster"
        ],
        correctIndex: 1,
        explanation: "A composite index (colA, colB) satisfies queries filtering on (colA) or (colA, colB) in a single index scan without bitmap index merges."
      }
    ]
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / ML Engineer',
    icon: 'Cpu',
    description: 'LLM fine-tuning, RAG architectures, model quantization, high-throughput inference engines',
    requiredSkills: {
      'PyTorch & Deep Learning': 92,
      'LLMs & Transformer Arch': 90,
      'RAG & Vector Databases': 88,
      'Model Optimization & Quant': 82,
      'CUDA & GPU Acceleration': 75,
      'MLOps & Tracing': 80,
    },
    suggestedMissingSkills: [
      { name: 'Retrieval Augmented Generation (RAG)', level: 'Intermediate', category: 'LLMs', priority: 'Critical', reason: 'Hybrid dense/sparse retrieval and rerankers' },
      { name: 'Model Quantization (GGUF/AWQ)', level: 'Intermediate', category: 'Inference', priority: 'High', reason: 'Low-latency deployment on constrained VRAM' },
      { name: 'Vector Indexing (HNSW / IVFFlat)', level: 'Intermediate', category: 'Embeddings', priority: 'Medium', reason: 'High dimensional approximate nearest neighbor' }
    ],
    interviewQuestions: [
      {
        id: 1,
        question: "How does Self-Attention scale computationally with sequence length, and what optimizations address this bottleneck?",
        expectedKeywords: ['o(n^2)', 'quadratic', 'flashattention', 'kv cache', 'sparse attention', 'linear attention', 'chunking', 'memory bandwidth'],
        sampleGoodAnswer: "Standard scaled dot-product attention scales as O(N^2) with sequence length N due to the attention matrix NxN. FlashAttention optimizes this by computing softmax without materializing the full NxN matrix in high-bandwidth GPU memory (HBM), tiling computation in SRAM. During inference, KV-caching avoids recomputing previous token keys/values.",
      }
    ],
    quizQuestions: [
      {
        id: 'q1',
        category: 'LLMs & Transformer Arch',
        difficulty: 'Medium',
        question: "What is the primary role of RoPE (Rotary Position Embedding) in modern LLMs like Llama?",
        options: [
          "It compresses the model weights by 50%",
          "It encodes relative token positions by rotating query and key representations in the complex plane",
          "It forces the model to ignore stop words",
          "It replaces the feed-forward network layer"
        ],
        correctIndex: 1,
        explanation: "RoPE applies complex rotation matrices to query and key vectors, allowing self-attention scores to naturally decay or interact based on relative distance."
      }
    ]
  }
];

export const SAMPLE_CANDIDATE_DATA = {
  name: "Neshat Patel",
  email: "neshat.patel@engineering.edu",
  targetRole: "data-scientist",
  university: "National Institute of Technology",
  degree: "B.Tech in Computer Science & Engineering",
  graduationYear: "2026",
  gpa: "3.92 / 4.0 (9.4 CGPA)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  verificationBadge: "Verified Candidate Tier-1",
  verifiedDate: "2026-10-06",
  trustScore: 98.6,
  
  // 1. Marksheet details
  marksheet: {
    fileName: "marksheet_official_transcripts_neshat.pdf",
    verified: true,
    verificationMethod: "Digital Signature & University Cryptographic Stamp",
    hash: "sha256:4a8b79e13d902ff21048bce904712c9e782910cba763198031d",
    courses: [
      { code: "CS301", name: "Data Structures & Algorithms", grade: "A+", credits: 4, score: 96 },
      { code: "CS402", name: "Machine Learning Foundations", grade: "A", credits: 4, score: 92 },
      { code: "MA201", name: "Linear Algebra & Multivariable Calculus", grade: "A+", credits: 4, score: 98 },
      { code: "CS305", name: "Database Management Systems", grade: "A", credits: 3, score: 91 },
      { code: "CS410", name: "Distributed Systems & Cloud", grade: "B+", credits: 3, score: 84 },
    ]
  },

  // 2. Certificates
  certificates: [
    {
      id: "CERT-ML-2025-992",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI / Coursera",
      issueDate: "Nov 2025",
      credentialUrl: "https://coursera.org/verify/DL-992-NESHAT",
      qrCodeData: "https://verify.deeplearning.ai/cert/DL-992-NESHAT-SECURE-SHA256",
      verified: true,
      skillsVerified: ["Neural Networks", "PyTorch", "Hyperparameter Tuning", "Convolutional Nets"],
      verificationStatus: "Cryptographically Verified",
      signatureHash: "sig_rsa4096_88fb037aa901",
    },
    {
      id: "CERT-AWS-MLA-774",
      title: "AWS Certified Machine Learning Specialty",
      issuer: "Amazon Web Services",
      issueDate: "Jan 2026",
      credentialUrl: "https://aws.amazon.com/verification/AWS-MLA-774",
      qrCodeData: "https://aws.amazon.com/verification/AWS-MLA-774-HASH-OK",
      verified: true,
      skillsVerified: ["SageMaker", "Feature Store", "Model Registry", "Cloud Infrastructure"],
      verificationStatus: "Cryptographically Verified",
      signatureHash: "sig_ecdsa_930f142bcd78",
    }
  ],

  // 3. GitHub
  github: {
    username: "neshat-dev",
    profileUrl: "https://github.com/neshat-dev",
    totalRepos: 24,
    publicReposScraped: 4,
    totalCommitsLastYear: 842,
    commitVelocity: "High (4.8 commits/day)",
    originalityScore: "96.4% (Non-forked, custom architecture)",
    topLanguages: [
      { name: "Python", percentage: 58, color: "#3572A5" },
      { name: "Jupyter Notebook", percentage: 22, color: "#DA5B0B" },
      { name: "TypeScript", percentage: 14, color: "#3178C6" },
      { name: "SQL", percentage: 6, color: "#E38C00" },
    ],
    showcaseRepos: [
      {
        name: "fraud-anomaly-detector",
        description: "Real-time financial transaction fraud detector using Isolation Forest & LightGBM streaming inference",
        stars: 142,
        forks: 28,
        verifiedCodebase: true,
        license: "MIT",
        techStack: ["Python", "LightGBM", "FastAPI", "Docker", "Redis"],
      },
      {
        name: "multimodal-rag-pipeline",
        description: "Hybrid vector search with dense Qdrant index + BM25 sparse reranker for biomedical paper synthesis",
        stars: 89,
        forks: 14,
        verifiedCodebase: true,
        license: "Apache-2.0",
        techStack: ["PyTorch", "Qdrant", "LangChain", "FastAPI"],
      },
      {
        name: "distributed-feature-store",
        description: "Point-in-time correct feature extraction engine for temporal tabular machine learning pipelines",
        stars: 64,
        forks: 9,
        verifiedCodebase: true,
        license: "MIT",
        techStack: ["Python", "DuckDB", "Apache Arrow", "Parquet"],
      }
    ]
  },

  // 4. LeetCode
  leetcode: {
    username: "neshat_codes",
    profileUrl: "https://leetcode.com/u/neshat_codes",
    totalSolved: 348,
    ranking: "Top 4.2% (Rating 1892)",
    easy: 124,
    medium: 182,
    hard: 42,
    acceptanceRate: "68.4%",
    contestRating: 1892,
    globalRank: "18,420",
    badges: ["Knight", "50 Days Badge 2026", "Graph Master"]
  },

  // 5. Skill Competencies & Radar Data
  skillRadar: [
    { skill: "Python Skills", current: 85, target: 90, fullMark: 100 },
    { skill: "Machine Learning", current: 78, target: 88, fullMark: 100 },
    { skill: "Deep Learning", current: 70, target: 75, fullMark: 100 },
    { skill: "SQL & Data Wrangling", current: 82, target: 85, fullMark: 100 },
    { skill: "Statistics & Math", current: 88, target: 92, fullMark: 100 },
    { skill: "MLOps & Cloud", current: 62, target: 70, fullMark: 100 },
  ],

  // 6. Employability Metrics
  employabilityAssessment: {
    overallScore: 91,
    grade: "Elite Candidate (Top 3.8%)",
    hireabilityStatus: "Industry Ready - High Employability Index",
    breakdown: {
      technicalCompetence: 92,
      academicFoundations: 95,
      projectOriginality: 94,
      problemSolvingLeetcode: 88,
      verifiedCredentialsIntegrity: 99,
      aiMockInterviewCommunication: 89,
    },
    percentile: 96.2,
    salaryBenchmark: "$115,000 - $145,000 / yr (US Market Equiv.)",
  }
};
