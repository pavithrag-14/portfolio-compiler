// 50-Question MCQ Banks for Portfolio Compiler Technical Assessment Engine
// Every topic contains EXACTLY 50 questions (15 Easy, 25 Medium, 10 Hard)

export const TOPICS = [
  { id: 'python', name: 'Python Programming', category: 'Programming', description: 'Core Python, data structures, OOP, functional patterns, and memory management' },
  { id: 'ui-ux', name: 'UI/UX Design', category: 'Design', description: 'User research, wireframing, usability heuristics, typography, interaction design, and Figma' },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'Computer Science', description: 'Arrays, Trees, Graphs, Dynamic Programming, Big-O complexity, and recursion' },
  { id: 'sql', name: 'SQL & Database Systems', category: 'Databases', description: 'Relational algebra, indexes, joins, ACID properties, normalization, and optimization' },
  { id: 'ml', name: 'Machine Learning', category: 'AI/Data Science', description: 'Supervised/unsupervised algorithms, evaluation metrics, overfitting, feature engineering' },
  { id: 'web-dev', name: 'Full Stack Web Development', category: 'Web Development', description: 'HTML/CSS/JS, React, Node.js, REST APIs, security, and performance' },
  { id: 'cloud-devops', name: 'Cloud & DevOps Engineering', category: 'Cloud/DevOps', description: 'Docker, Kubernetes, CI/CD, AWS fundamentals, infrastructure as code, monitoring' }
];

// Helper to generate verified topic banks with exact 15 Easy, 25 Medium, 10 Hard count
function createTopicQuestions(topicId, topicName, easyList, mediumList, hardList) {
  const result = [];
  let idCounter = 1;

  easyList.forEach((q) => {
    result.push({
      id: idCounter++,
      topicId,
      topicName,
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      difficulty: 'Easy',
      explanation: q.exp
    });
  });

  mediumList.forEach((q) => {
    result.push({
      id: idCounter++,
      topicId,
      topicName,
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      difficulty: 'Medium',
      explanation: q.exp
    });
  });

  hardList.forEach((q) => {
    result.push({
      id: idCounter++,
      topicId,
      topicName,
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      difficulty: 'Hard',
      explanation: q.exp
    });
  });

  if (result.length !== 50) {
    console.warn(`Topic ${topicId} has ${result.length} questions, expected 50!`);
  }

  return result;
}

// 1. Python Question Set (15 Easy, 25 Medium, 10 Hard = 50)
const pythonEasy = [
  { q: "What is the output of print(type([])) in Python?", opts: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"], ans: 1, exp: "Square brackets define a list object in Python." },
  { q: "Which keyword is used to define a function in Python?", opts: ["func", "function", "def", "lambda"], ans: 2, exp: "The 'def' keyword is used to declare standard functions." },
  { q: "What is the index of the first element in a Python list?", opts: ["-1", "0", "1", "None"], ans: 1, exp: "Python lists are 0-indexed." },
  { q: "How do you insert an element at the end of a list in Python?", opts: [".add()", ".insert()", ".append()", ".push()"], ans: 2, exp: "The .append() method appends an item to the end of a list." },
  { q: "Which data type is immutable in Python?", opts: ["List", "Dictionary", "Set", "Tuple"], ans: 3, exp: "Tuples cannot be modified once instantiated." },
  { q: "What does the 'len()' function return?", opts: ["Size in bytes", "The number of items in a collection", "The maximum integer value", "The type of object"], ans: 1, exp: "len() returns the length (item count) of an object." },
  { q: "Which operator is used for exponentiation in Python?", opts: ["^", "**", "pow", "//"], ans: 1, exp: "** is the exponentiation operator (e.g. 2 ** 3 = 8)." },
  { q: "What is the boolean evaluation of bool(0) in Python?", opts: ["True", "False", "None", "Error"], ans: 1, exp: "0 evaluates to False in boolean context." },
  { q: "Which statement is used to terminate a loop prematurely?", opts: ["stop", "exit", "break", "return"], ans: 2, exp: "break exits the innermost executing loop." },
  { q: "What does the 'pass' statement do in Python?", opts: ["Skips to next iteration", "Exits program", "Acts as a null placeholder statement", "Passes arguments"], ans: 2, exp: "pass is a syntactical no-op placeholder." },
  { q: "Which method converts a string to all lowercase characters?", opts: [".toLower()", ".lower()", ".casefold_all()", ".down()"], ans: 1, exp: ".lower() returns a lowercase copy of the string." },
  { q: "How do you create a dictionary in Python?", opts: ["{}", "[]", "()", "<>"], ans: 0, exp: "Curly braces {} are used for dictionaries (and sets)." },
  { q: "What does 'str(123)' do in Python?", opts: ["Errors", "Converts integer 123 into string '123'", "Parses a string", "Creates a pointer"], ans: 1, exp: "str() converts objects to their string representation." },
  { q: "Which keyword handles exceptions in Python?", opts: ["catch", "except", "handle", "rescue"], ans: 1, exp: "try/except blocks are used for exception handling." },
  { q: "What is the output of 7 // 2 in Python?", opts: ["3.5", "3", "4", "3.0"], ans: 1, exp: "// performs floor division yielding an integer." }
];

const pythonMedium = [
  { q: "What is the difference between 'is' and '==' in Python?", opts: ["'==' checks identity, 'is' checks value", "'is' checks memory identity, '==' checks value equality", "They are identical", "'is' is for strings only"], ans: 1, exp: "'is' compares memory references (id(a) == id(b)), whereas '==' checks equality of values." },
  { q: "How does a generator function differ from a normal function?", opts: ["It returns a tuple", "It yields values lazily on-demand using yield", "It runs in parallel threads", "It cannot take arguments"], ans: 1, exp: "Generators pause execution and yield values one at a time via the iterator protocol." },
  { q: "What is the time complexity of looking up a key in a Python dict on average?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 2, exp: "Python dictionaries use hash tables, providing O(1) average lookup time." },
  { q: "What does the '*args' parameter do in a function definition?", opts: ["Requires keyword arguments", "Collects arbitrary positional arguments into a tuple", "Unpacks dictionaries", "Forces pointer math"], ans: 1, exp: "*args collects positional arguments into a tuple." },
  { q: "What does '**kwargs' collect in a function signature?", opts: ["Positional arguments", "Arbitrary keyword arguments into a dict", "Global variables", "Type hints"], ans: 1, exp: "**kwargs captures named keyword arguments into a dictionary." },
  { q: "What is list comprehension syntax in Python?", opts: ["for x in list: [x]", "[expression for item in iterable if condition]", "{item: value for item in list}", "(x for x in list)"], ans: 1, exp: "[expression for item in iterable] is the standard list comprehension form." },
  { q: "What is the purpose of the '__init__' method in a class?", opts: ["To destroy the object", "To initialize instance attributes upon creation", "To define static methods", "To override operators"], ans: 1, exp: "__init__ is the initializer constructor called when creating an instance." },
  { q: "What does 'copy.deepcopy()' do compared to shallow copy?", opts: ["Copies only top-level references", "Recursively duplicates all nested objects", "Freezes the object", "Compresses memory"], ans: 1, exp: "deepcopy recursively clones nested compound objects so modifications do not bleed through." },
  { q: "What is a lambda function in Python?", opts: ["A named multiline procedure", "An anonymous inline function restricted to a single expression", "A C-extension", "A background thread"], ans: 1, exp: "lambda defines anonymous small functions that evaluate a single expression." },
  { q: "What is the purpose of the 'with' statement in Python?", opts: ["To import modules", "To manage context and guarantee resource cleanup via context managers", "To loop through collections", "To inherit classes"], ans: 1, exp: "The 'with' statement guarantees entry (__enter__) and exit (__exit__) resource cleanup." },
  { q: "What will 'set([1, 2, 2, 3, 3, 3])' produce?", opts: ["{1, 2, 2, 3, 3, 3}", "{1, 2, 3}", "[1, 2, 3]", "An error"], ans: 1, exp: "Sets store unique elements only, stripping duplicate values." },
  { q: "Which built-in module provides regex support in Python?", opts: ["regexlib", "re", "regex", "pattern"], ans: 1, exp: "The 're' module provides regular expression operations." },
  { q: "What does 'enumerate(iterable)' return?", opts: ["Only the values", "Pairs of (index, value)", "A reversed list", "Sorted keys"], ans: 1, exp: "enumerate yields tuples of (index, item) during iteration." },
  { q: "What is the GIL in CPython?", opts: ["Global Interface Language", "Global Interpreter Lock which serializes bytecode execution to one thread", "General Input Loop", "Garbage Inline Level"], ans: 1, exp: "The GIL prevents multiple native threads from executing Python bytecodes simultaneously in CPython." },
  { q: "What does the '@property' decorator do?", opts: ["Makes a class abstract", "Allows a method to be accessed like an attribute", "Caches return values", "Marks attribute as private"], ans: 1, exp: "@property defines a getter method accessed using attribute syntax." },
  { q: "How is string slicing 's[1:5:2]' interpreted?", opts: ["From index 1 to 4 with step 2", "From index 1 to 5 with step 2", "Index 1 and 5 only", "Substring of length 2"], ans: 0, exp: "Start 1, stop 5 (exclusive), step 2 selects indices 1 and 3." },
  { q: "What happens if a function does not have an explicit return statement?", opts: ["It returns 0", "It returns None", "It throws an exception", "It returns False"], ans: 1, exp: "Python functions return None by default if no return is executed." },
  { q: "What does the 'zip()' function do?", opts: ["Compresses files to .zip", "Combines multiple iterables element-wise into tuples", "Encrypts strings", "Reverses a list"], ans: 1, exp: "zip() takes iterables and aggregates corresponding elements into tuples." },
  { q: "What is the output of 'bool([])' and 'bool([0])'?", opts: ["True, True", "False, False", "False, True", "True, False"], ans: 2, exp: "An empty list is falsy; a list with one item [0] is non-empty and truthy." },
  { q: "How are default mutable arguments (e.g. def fn(x=[])) dangerous in Python?", opts: ["They cause syntax errors", "The default list is instantiated once at function definition and shared across calls", "They consume too much RAM", "They cannot be overwritten"], ans: 1, exp: "Default parameter expressions are evaluated once when the function is defined, persisting across invocations." },
  { q: "What does the 'filter()' function do?", opts: ["Transforms elements", "Filters elements from an iterable based on a predicate function returning True", "Removes duplicate values", "Sorts items"], ans: 1, exp: "filter(predicate, iterable) extracts elements for which the predicate returns True." },
  { q: "What is the result of '1, 2, 3' without parentheses in Python?", opts: ["SyntaxError", "A tuple (1, 2, 3)", "A list [1, 2, 3]", "Integer 3"], ans: 1, exp: "Comma-separated values without brackets are packed into a tuple." },
  { q: "What is the purpose of '__slots__' in a Python class?", opts: ["Defines private methods", "Restricts valid attributes and prevents default __dict__ creation to optimize memory", "Enables multithreading", "Defines serialization format"], ans: 1, exp: "__slots__ reduces memory overhead by allocating fixed space for declared attributes instead of a dict." },
  { q: "How do you check if an object is an instance of a subclass of a type?", opts: ["isinstance(obj, Class)", "obj.type == Class", "typeof(obj, Class)", "obj.is(Class)"], ans: 0, exp: "isinstance(object, classinfo) supports inheritance hierarchies." },
  { q: "What does the 'collections.defaultdict' provide?", opts: ["A read-only dictionary", "A dictionary that automatically initializes missing keys with a default factory", "A sorted dictionary", "A dictionary stored on disk"], ans: 1, exp: "defaultdict supplies a default value when a queried key does not exist." }
];

const pythonHard = [
  { q: "How does Python manage memory and detect cyclic reference garbage?", opts: ["Mark-and-sweep exclusively", "Reference counting combined with a cyclic garbage collector using three generations", "Manual malloc and free", "Stack allocation only"], ans: 1, exp: "CPython uses reference counting as primary cleanup and a generational garbage collector to identify reference cycles." },
  { q: "What is a metaclass in Python?", opts: ["A class with multiple inheritance", "A class whose instances are themselves classes (e.g. 'type')", "A module written in C", "A class template"], ans: 1, exp: "Metaclasses define how classes are constructed; 'type' is the default metaclass in Python." },
  { q: "What is the difference between '__new__' and '__init__'?", opts: ["__init__ allocates memory, __new__ initializes", "__new__ creates and returns the instance, while __init__ initializes the created instance", "__new__ is only for abstract classes", "They are identical aliases"], ans: 1, exp: "__new__ is the static constructor that creates the instance before __init__ is called." },
  { q: "In the context of asyncio, what is an Event Loop?", opts: ["A GUI render loop", "The core engine that schedules and coordinates execution of asynchronous tasks and I/O callbacks", "A CPU spinning while loop", "A garbage collector loop"], ans: 1, exp: "The asyncio event loop manages execution of cooperative coroutines and event handlers on a single thread." },
  { q: "How does Method Resolution Order (MRO) work in Python 3?", opts: ["Left-to-right depth-first search", "C3 Linearization algorithm", "Breadth-first search", "Random topological sort"], ans: 1, exp: "Python uses the C3 Linearization algorithm to determine monotonic MRO in multiple inheritance." },
  { q: "What does the 'sys.intern()' function do in Python?", opts: ["Converts strings to unicode", "Enters string into internal string pool so identity comparisons (is) can be used", "Encrypts memory buffers", "Forces garbage collection"], ans: 1, exp: "String interning ensures that strings with identical values share the exact same memory address." },
  { q: "How does the 'yield from' expression enhance generators?", opts: ["Terminates the generator", "Delegates iteration directly to a sub-generator and handles two-way value/exception transmission", "Converts generator to list", "Enables multiprocessing"], ans: 1, exp: "'yield from' transparently delegates to subiterators, handling .send(), .throw(), and .close()." },
  { q: "What is the role of '__repr__' vs '__str__'?", opts: ["__repr__ is for informal end-user display, __str__ is for debugging", "__str__ is for human-readable string representation, __repr__ is unambiguous representation for developers", "They are identical", "__repr__ only outputs XML"], ans: 1, exp: "__repr__ aims to be unambiguous (often valid Python code), while __str__ is readable for users." },
  { q: "What happens when you modify a list while iterating over it with a standard for loop?", opts: ["Python raises ConcurrentModificationException", "Indices shift, causing skipped or repeated elements unexpectedly", "The loop pauses automatically", "Memory is corrupted"], ans: 1, exp: "The loop index increments sequentially regardless of mutations, causing skipped or duplicate iterations." },
  { q: "How do Context Managers handle exceptions raised inside a 'with' block?", opts: ["They ignore exceptions", "The __exit__ method receives (exc_type, exc_val, exc_tb); returning True suppresses the exception", "They crash Python immediately", "Exceptions cannot be caught"], ans: 1, exp: "If __exit__ returns True, the exception is suppressed; returning False or None propagates it." }
];

export const PYTHON_MCQS = createTopicQuestions('python', 'Python Programming', pythonEasy, pythonMedium, pythonHard);

// 2. UI/UX Design Question Set (15 Easy, 25 Medium, 10 Hard = 50)
const uiuxEasy = [
  { q: "What does 'UI' stand for in product design?", opts: ["Universal Interface", "User Interface", "User Interaction", "Unified Integration"], ans: 1, exp: "UI stands for User Interface, focusing on visual touchpoints." },
  { q: "What does 'UX' stand for?", opts: ["User Experience", "User Examination", "Universal Xenon", "Unified XML"], ans: 0, exp: "UX stands for User Experience, encompassing the overall satisfaction and usability." },
  { q: "Which tool is an industry standard for collaborative UI design and prototyping?", opts: ["Vim", "Figma", "Docker", "Postman"], ans: 1, exp: "Figma is a cloud-based design and prototyping tool widely used in product design." },
  { q: "What is a 'wireframe'?", opts: ["A high-fidelity coded website", "A low-fidelity structural blueprint of a screen layout", "A brand color palette", "A marketing banner"], ans: 1, exp: "Wireframes define page structure, content hierarchy, and spatial arrangement without visual polish." },
  { q: "What is the primary purpose of 'whitespace' (negative space) in design?", opts: ["To save screen pixels", "To provide visual breathing room, clarity, and group relationships", "To show unfinished sections", "To print cheaper"], ans: 1, exp: "Whitespace reduces cognitive load and highlights key elements." },
  { q: "What does 'CTA' stand for in web design?", opts: ["Color To Action", "Call To Action", "Click Through Angle", "Central Task Area"], ans: 1, exp: "Call to Action is a prompt (button/link) encouraging the user to take a specific action." },
  { q: "Which color model is used for screen displays?", opts: ["CMYK", "RGB", "Pantone", "RAL"], ans: 1, exp: "RGB (Red, Green, Blue) is the additive color model used for electronic screens." },
  { q: "What is a 'User Persona'?", opts: ["A real legal identity of an employee", "A fictional archetype representing target user goals and behaviors", "A design system color", "A password hash"], ans: 1, exp: "User personas synthesize research into realistic representative user profiles." },
  { q: "What does 'accessibility' (a11y) mean in digital design?", opts: ["Making software available offline", "Ensuring products are usable by people of all abilities, including those with disabilities", "Translating code into English", "Adding password security"], ans: 1, exp: "Accessibility ensures equal access and functionality for individuals with diverse abilities." },
  { q: "What is typography hierarchy?", opts: ["Alphabetical order of letters", "Arranging headings, subheadings, and body text in size and weight to guide reading flow", "Using random fonts", "All-caps text styling"], ans: 1, exp: "Visual hierarchy in typography guides the eye to important information first." },
  { q: "What is the minimum recommended touch target size on mobile devices according to guidelines?", opts: ["12x12 px", "24x24 px", "44x44 px (or 48x48 dp)", "100x100 px"], ans: 2, exp: "Apple and Android guidelines recommend roughly 44x44 pt / 48x48 dp touch targets." },
  { q: "What is a 'mockup' in the design process?", opts: ["A functional React component", "A static mid-to-high fidelity visual rendering of the product design", "A database schema", "A user interview script"], ans: 1, exp: "Mockups showcase colors, fonts, and visual styling before interactive prototyping." },
  { q: "What is an 'Affordance' in design?", opts: ["The monetary cost of an app", "Visual properties of an object that communicate how it can be used", "The download speed", "The server architecture"], ans: 1, exp: "Affordances suggest interaction (e.g. a raised button visually communicates that it can be pressed)." },
  { q: "Which file format supports vector graphics for crisp scaling at any resolution?", opts: ["JPEG", "GIF", "SVG", "BMP"], ans: 2, exp: "SVG (Scalable Vector Graphics) maintains sharpness at any zoom level." },
  { q: "What is a 'Breadcrumb' in navigation?", opts: ["A cache cookie", "A secondary navigation trail showing user location in the site hierarchy", "A broken link", "A visual banner"], ans: 1, exp: "Breadcrumbs help users understand page hierarchy (e.g. Home > Products > Shoes)." }
];

const uiuxMedium = [
  { q: "What are Nielsen's 10 Usability Heuristics?", opts: ["10 rules for backend database design", "Widely recognized rules of thumb for human-computer interaction design", "10 CSS rules", "Color theory formulas"], ans: 1, exp: "Jakob Nielsen's heuristics evaluate usability flaws across software interfaces." },
  { q: "What does the heuristic 'Visibility of System Status' mean?", opts: ["Showing raw SQL queries", "Keeping users informed about what is going on through appropriate feedback in reasonable time", "Making all menus visible at once", "Hiding error messages"], ans: 1, exp: "Interfaces must communicate progress (e.g., loading spinners, progress bars, toasts)." },
  { q: "What is the purpose of an A/B Test?", opts: ["Testing software on 2 computers", "Comparing two variants of a design to see which performs better on a target metric", "Testing alphabetical sorting", "Checking database backup"], ans: 1, exp: "A/B testing evaluates real user conversion or task completion rates between variant A and B." },
  { q: "What does 'Information Architecture' (IA) focus on?", opts: ["Server rack hardware", "Organizing, structuring, and labeling content so users can navigate intuitively", "Writing copyright terms", "CSS grid compilation"], ans: 1, exp: "IA structures websites and apps into logical taxonomies, sitemaps, and user flows." },
  { q: "What is 'Card Sorting' used for?", opts: ["Payment gateway testing", "Research method to discover how users naturally categorize and label concepts", "Memory games for designers", "Kanban task tracking"], ans: 1, exp: "Card sorting guides information architecture and navigation menu organization." },
  { q: "What is Hick's Law in UX design?", opts: ["The time it takes to make a decision increases logarithmically with the number and complexity of choices", "Users read from left to right", "Mobile screens must have 3 buttons max", "Pages must load under 1 second"], ans: 0, exp: "Hick's law states that more options cause longer decision time and cognitive friction." },
  { q: "What is Fitts's Law in interaction design?", opts: ["The time required to rapidly move to a target is a function of the distance to and width of the target", "The contrast ratio of text", "The number of form inputs allowed", "The speed of animations"], ans: 0, exp: "Fitts's Law explains why larger and closer interactive buttons are faster and easier to click." },
  { q: "What is a 'Design System'?", opts: ["A computer running Figma", "A single source of truth containing reusable components, tokens, and style guidelines", "A Photoshop plugin", "A client contract"], ans: 1, exp: "Design systems ensure brand consistency, accessible tokens, and modular developer handoff." },
  { q: "What is the WCAG AA requirement for normal text contrast ratio?", opts: ["2:1", "3:1", "4.5:1", "7:1"], ans: 2, exp: "WCAG 2.1 Level AA requires at least 4.5:1 contrast ratio for standard body text." },
  { q: "What is the difference between qualitative and quantitative UX research?", opts: ["Qualitative measures numbers; quantitative explores feelings", "Qualitative explores 'why' and behaviors; quantitative measures 'how many' with metrics", "They are identical", "Qualitative is only done after launch"], ans: 1, exp: "Qualitative reveals insights, thoughts, and reasoning; quantitative provides statistical measurements." },
  { q: "What is the 'Golden Ratio' in composition?", opts: ["Approximately 1:1.618", "1:2", "3:4", "16:9"], ans: 0, exp: "1.618 is the golden proportion frequently used to create aesthetically pleasing layout ratios." },
  { q: "In Figma, what does 'Auto Layout' provide?", opts: ["Draws vectors automatically", "Creates dynamic responsive frames that expand, shrink, and wrap based on content padding and direction", "Exports code to production servers", "Generates color gradients"], ans: 1, exp: "Auto Layout mimics CSS flexbox for responsive, modular component styling." },
  { q: "What is a 'Micro-interaction'?", opts: ["A tiny web banner", "A subtle, single-purpose animation or feedback loop that confirms user action", "A fast user interview", "A microservice API call"], ans: 1, exp: "Micro-interactions provide delightful feedback (e.g. like button toggle, toggle switch snap, pull-to-refresh)." },
  { q: "What is 'Mental Model' in UX?", opts: ["A designer's sketch", "What the user believes they know about how a system or real-world concept works", "An AI machine learning model", "A wireframe template"], ans: 1, exp: "Good UX bridges the gap between the user's mental model and the system's actual conceptual model." },
  { q: "What is 'Progressive Disclosure'?", opts: ["Showing all options immediately on screen", "Sequencing information and complex actions across steps to avoid overwhelming the user", "Revealing prices at checkout only", "A loading bar"], ans: 1, exp: "Progressive disclosure keeps primary screens uncluttered, revealing secondary options on demand." },
  { q: "What is the 'F-shaped pattern' observed in eye-tracking studies?", opts: ["Users read only footer links", "Web users scan horizontal top bars, then down the left side in an F shape", "Users look in circles", "Users read right-to-left"], ans: 1, exp: "Users reading text-heavy web pages scan horizontally across the top, followed by shorter horizontal sweeps below." },
  { q: "What is 'Usability Testing'?", opts: ["Testing server CPU loads", "Observing real users attempting representative tasks with a product to identify usability barriers", "Proofreading copy", "Testing database failover"], ans: 1, exp: "Usability testing uncovers friction, confusion, and task failure points." },
  { q: "What is an 'Empathy Map'?", opts: ["A geolocation map", "A collaborative visualization used to articulate what a user Says, Thinks, Does, and Feels", "A sitemap diagram", "A color wheel"], ans: 1, exp: "Empathy maps help teams align on user perspectives and emotional states." },
  { q: "What does 'Skeuomorphism' refer to in UI design?", opts: ["Flat minimalist vector designs", "Design style imitating real-world physical textures, shadows, and materials (e.g. leather, beveled glass)", "Monochrome wireframes", "Terminal interfaces"], ans: 1, exp: "Skeuomorphism replicates realistic physical metaphors in digital interfaces." },
  { q: "What is 'Neumorphism' (Soft UI)?", opts: ["Bold saturated brutalist designs", "Soft extruded plastic look achieved through dual light and dark drop shadows", "Cyberpunk neon gradients", "Text-only interfaces"], ans: 1, exp: "Neumorphism blends background and foreground using subtle inner and drop shadow techniques." },
  { q: "What does 'SUS' stand for in UX evaluation?", opts: ["Software Usability Suite", "System Usability Scale (a standard 10-item questionnaire)", "Standard User Survey", "System Update Signal"], ans: 1, exp: "System Usability Scale (SUS) generates a standardized 0-100 usability score." },
  { q: "What is the difference between low-fidelity and high-fidelity prototypes?", opts: ["Low-fi is slow; high-fi is fast", "Low-fi focuses on flow and layout; high-fi includes realistic visuals, interactions, and content", "Low-fi is only for print", "High-fi cannot be tested"], ans: 1, exp: "Low-fi enables quick iterations; high-fi validates refined visual design and detailed micro-interactions." },
  { q: "What is the 'Kano Model' used for in product strategy?", opts: ["Measuring server speed", "Classifying customer preferences into Basic, Performance, and Delighter features", "Estimating Figma licenses", "Color contrast testing"], ans: 1, exp: "The Kano model prioritizes features based on their emotional impact on customer satisfaction." },
  { q: "Why is 'Lorem Ipsum' placeholder copy risky during late-stage usability testing?", opts: ["It causes browser crashes", "It obscures real context, content hierarchy, and comprehension issues that real copy would expose", "It is copyrighted", "It violates accessibility guidelines"], ans: 1, exp: "Realistic content is essential to test whether users can actually comprehend and act on screen information." },
  { q: "What is an 'Icon Labeling' best practice in navigation?", opts: ["Never use labels to save space", "Always accompany abstract or ambiguous icons with clear text labels", "Use animated rotating icons", "Change icons randomly"], ans: 1, exp: "Pairing icons with labels significantly reduces user hesitation and misinterpretation." }
];

const uiuxHard = [
  { q: "How do Design Tokens bridge Figma designs and production codebases?", opts: ["They automatically export Figma files to PDF", "They store design decisions (colors, spacing, typography) as platform-agnostic variables synced to CSS/JSON", "They create Bitcoin transactions", "They replace designers with AI"], ans: 1, exp: "Design tokens serve as the single source of truth connecting design specs to CSS custom properties and mobile styles." },
  { q: "What is the 'Doherty Threshold' in human-computer interaction?", opts: ["Users leave after 5 seconds", "Computer-human interaction is most productive when system response time is under 400 milliseconds", "The minimum font size for web typography", "Maximum buttons on a toolbar"], ans: 1, exp: "Productivity increases dramatically when system feedback occurs within 400ms, maintaining user flow." },
  { q: "What does 'Cognitive Load Theory' suggest for complex dashboard designs?", opts: ["Maximize visual stimulants simultaneously", "Minimize extraneous cognitive load through chunking, progressive disclosure, and clear visual hierarchy", "Remove all charts and graphs", "Force users to memorize shortcuts"], ans: 1, exp: "Limiting extraneous load frees working memory for germane processing and critical decision making." },
  { q: "In accessibility, what is the role of the 'ARIA live region'?", opts: ["Plays background sound effects", "Announces dynamic asynchronous content changes to assistive screen readers without reloading the page", "Forces fullscreen video", "Validates credit card forms"], ans: 1, exp: "aria-live regions ('polite' or 'assertive') notify screen reader users when content updates dynamically." },
  { q: "What is the difference between 'Usability' and 'Utility' in product design?", opts: ["They are interchangeable synonyms", "Utility is whether it provides features users need; Usability is how easy and pleasant those features are to use", "Utility is visual, Usability is functional", "Usability is for mobile only"], ans: 1, exp: "A product can be usable but useless (no utility), or useful (has utility) but frustratingly hard to use (poor usability)." },
  { q: "How does the 'Peak-End Rule' affect user retrospectives of an experience?", opts: ["Users evaluate an experience primarily by its emotional peak and its ending, rather than the average of every moment", "Users only remember the start", "Users remember every second equally", "Users always prefer the longest flow"], ans: 0, exp: "Kahneman's Peak-End Rule demonstrates that peak moments and the conclusion dictate overall memory." },
  { q: "What is 'Heuristic Walkthrough' compared to standard Cognitive Walkthrough?", opts: ["Heuristic uses broad usability principles; Cognitive walkthrough tests specific predefined task sequences from a novice user's mental steps", "They are identical", "Heuristic requires 100 users", "Cognitive uses automated robots"], ans: 0, exp: "Cognitive walkthrough specifically assesses if a user will know what to do at each sequential action in a task." },
  { q: "What constitutes an accessible keyboard focus indicator under WCAG 2.2?", opts: ["Removing outline with outline: none", "A visible indicator with sufficient contrast (>= 3:1) and minimum surface area against adjacent colors", "Flashing neon colors", "Sound cues only"], ans: 1, exp: "WCAG mandates visible focus rings with sufficient contrast and thickness so keyboard navigators know their exact active element." },
  { q: "What is 'Jakob's Law of Internet User Experience'?", opts: ["Users spend most of their time on other sites, so they expect your site to work like all the others they already know", "Users never click ads", "Websites must redesign every 6 months", "Links must be purple"], ans: 0, exp: "Familiar conventions reduce friction because users leverage mental models built from other applications." },
  { q: "What is 'Atomic Design' methodology formulated by Brad Frost?", opts: ["A quantum computing UI library", "Hierarchy dividing interface design into Atoms, Molecules, Organisms, Templates, and Pages", "Designing for subatomic pixel grids", "A React state manager"], ans: 1, exp: "Atomic design structures design systems from foundational atoms (buttons, inputs) to composite organisms and templates." }
];

export const UIUX_MCQS = createTopicQuestions('ui-ux', 'UI/UX Design', uiuxEasy, uiuxMedium, uiuxHard);

// 3. Data Structures & Algorithms (50 questions: 15 Easy, 25 Medium, 10 Hard)
const dsaEasy = [
  { q: "What is the time complexity to access an element by index in an array?", opts: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], ans: 0, exp: "Arrays have contiguous memory allowing instant O(1) index computation." },
  { q: "Which data structure operates on a First-In-First-Out (FIFO) basis?", opts: ["Stack", "Queue", "Tree", "Graph"], ans: 1, exp: "Queues process items in the order they were inserted (FIFO)." },
  { q: "Which data structure operates on a Last-In-First-Out (LIFO) basis?", opts: ["Queue", "Stack", "Heap", "Linked List"], ans: 1, exp: "Stacks operate on LIFO (like a stack of plates)." },
  { q: "What is the worst-case time complexity of Linear Search?", opts: ["O(1)", "O(log n)", "O(n)", "O(n!)"], ans: 2, exp: "Linear search checks every element sequentially in the worst case (O(n))." },
  { q: "What prerequisite is required before performing Binary Search on an array?", opts: ["Array must contain unique elements only", "Array must be sorted", "Array must be small", "Array must contain positive numbers"], ans: 1, exp: "Binary search requires sorted data to halve search spaces." },
  { q: "What is the time complexity of Binary Search on a sorted array of size n?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 1, exp: "Binary search divides the interval in half at each step, yielding O(log n)." },
  { q: "In a singly linked list, what does each node contain?", opts: ["Data and a pointer to the next node", "Data and pointer to parent", "Only data", "Two arrays"], ans: 0, exp: "A singly linked list node contains the payload and next reference." },
  { q: "What is the height of a balanced binary tree with N nodes?", opts: ["O(N)", "O(log N)", "O(N^2)", "O(1)"], ans: 1, exp: "A balanced binary tree has logarithmic height O(log N)." },
  { q: "Which sorting algorithm compares adjacent elements and swaps them if they are in the wrong order?", opts: ["Merge Sort", "Bubble Sort", "Quick Sort", "Heap Sort"], ans: 1, exp: "Bubble sort repeatedly steps through the list, swapping adjacent out-of-order elements." },
  { q: "What does 'Big-O' notation represent?", opts: ["Physical memory size", "Upper bound on algorithm growth rate as input size approaches infinity", "The number of code lines", "Compiler optimization level"], ans: 1, exp: "Big-O characterizes the worst-case asymptotic upper bound of time or space complexity." },
  { q: "What is the top node of a tree called?", opts: ["Leaf", "Branch", "Root", "Stem"], ans: 2, exp: "The root node is the topmost ancestor in a tree hierarchy." },
  { q: "What is a node with no children called in a tree?", opts: ["Root", "Leaf", "Anchor", "Orphan"], ans: 1, exp: "Leaf nodes have zero child pointers." },
  { q: "Which operation removes an item from a stack?", opts: ["Push", "Pop", "Enqueue", "Peek"], ans: 1, exp: "Pop removes and returns the top element of a stack." },
  { q: "What is the space complexity of an in-place sorting algorithm?", opts: ["O(1) auxiliary space", "O(N)", "O(N^2)", "O(log N)"], ans: 0, exp: "In-place algorithms require constant auxiliary space O(1) beyond input storage." },
  { q: "How many children can a node in a Binary Tree have at most?", opts: ["1", "2", "3", "Unlimited"], ans: 1, exp: "Binary trees restrict nodes to at most two children (left and right)." }
];

const dsaMedium = [
  { q: "What is the average time complexity of QuickSort?", opts: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], ans: 1, exp: "QuickSort exhibits O(n log n) expected time on random pivots." },
  { q: "What is the worst-case time complexity of QuickSort?", opts: ["O(n log n)", "O(n^2)", "O(n!)", "O(log n)"], ans: 1, exp: "When pivots partition maximally unbalanced subarrays, QuickSort degrades to O(n^2)." },
  { q: "What is the time complexity of MergeSort in the worst case?", opts: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], ans: 1, exp: "MergeSort guarantees O(n log n) time complexity across all cases." },
  { q: "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?", opts: ["Depth First Search", "Dijkstra's Algorithm", "Binary Search", "Kruskal's Algorithm"], ans: 1, exp: "Dijkstra's algorithm finds single-source shortest paths on non-negative weighted graphs." },
  { q: "What is the primary advantage of a Hash Table over an Array?", opts: ["Ordered traversal", "Average O(1) insertion, deletion, and lookup by key", "Guaranteed zero memory overhead", "Automatic sorting"], ans: 1, exp: "Hash tables provide constant-time average key lookups via hash functions." },
  { q: "What is 'Hash Collision' in a hash table?", opts: ["When the server crashes", "When two different keys produce the exact same hash code", "When the table is empty", "When keys are integers"], ans: 1, exp: "Collisions occur when two distinct keys map to the same bucket index." },
  { q: "How does 'Separate Chaining' resolve hash collisions?", opts: ["Deletes duplicate keys", "Stores colliding elements in a linked list or bucket at that index", "Hashes the key again into a new file", "Reboots the hash table"], ans: 1, exp: "Separate chaining attaches a linked list to each bucket to hold all collided elements." },
  { q: "What is the time complexity of inserting into a Min-Heap of size N?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 1, exp: "Inserting into a heap appends to the array and bubbles up in O(log N) steps." },
  { q: "What traversal order visits: Left Subtree, Root, Right Subtree?", opts: ["Pre-order", "In-order", "Post-order", "Level-order"], ans: 1, exp: "In-order traversal visits left child, current node, then right child (producing sorted order in BSTs)." },
  { q: "What traversal order visits: Root, Left Subtree, Right Subtree?", opts: ["In-order", "Pre-order", "Post-order", "Breadth-first"], ans: 1, exp: "Pre-order traversal processes the current node before traversing children." },
  { q: "What data structure is commonly used to implement Breadth-First Search (BFS)?", opts: ["Stack", "Queue", "Max-Heap", "Set only"], ans: 1, exp: "BFS uses a FIFO queue to explore nodes level-by-level." },
  { q: "What data structure is naturally used in Depth-First Search (DFS)?", opts: ["Queue", "Stack (or call stack recursion)", "Circular Buffer", "Hash Map"], ans: 1, exp: "DFS follows branches deeply using an explicit or call stack." },
  { q: "What is a circular linked list?", opts: ["A list with only 1 node", "A list where the last node points back to the first node", "A doubly linked list", "An array with circles"], ans: 1, exp: "In circular linked lists, the tail's next pointer references the head." },
  { q: "What is the time complexity of deleting a node from a Doubly Linked List when given the pointer to that node?", opts: ["O(N)", "O(1)", "O(log N)", "O(N^2)"], ans: 1, exp: "With prev and next pointers accessible, pointer rewiring executes in O(1) time." },
  { q: "What is an AVL Tree?", opts: ["An unorganized binary tree", "A self-balancing binary search tree where heights of child subtrees differ by at most 1", "A 4-ary tree", "A B-tree for disk storage"], ans: 1, exp: "AVL trees enforce height balance using rotations to maintain O(log N) operations." },
  { q: "What is Dynamic Programming fundamentally based on?", opts: ["Random guessing", "Overlapping subproblems and optimal substructure", "Brute-force iteration", "Sorting strings"], ans: 1, exp: "Dynamic programming caches answers to overlapping subproblems to avoid redundant computation." },
  { q: "What is the difference between Memoization and Tabulation?", opts: ["Memoization is bottom-up; Tabulation is top-down", "Memoization is top-down recursive caching; Tabulation is bottom-up iterative table filling", "They are identical", "Memoization uses queues only"], ans: 1, exp: "Memoization caches recursive call results top-down, whereas tabulation builds iterative arrays bottom-up." },
  { q: "What is the time complexity of finding the Minimum Spanning Tree using Kruskal's algorithm?", opts: ["O(V^3)", "O(E log E) or O(E log V)", "O(V)", "O(1)"], ans: 1, exp: "Kruskal's algorithm sorts edges in O(E log E) and utilizes Disjoint Set Union (Union-Find)." },
  { q: "What is the Disjoint Set Union (Union-Find) data structure used for?", opts: ["Sorting integers", "Tracking partitioned elements into disjoint subsets with near O(1) find/union via path compression", "String parsing", "Rendering graphics"], ans: 1, exp: "Union-Find maintains disjoint connected components efficiently." },
  { q: "What is the worst-case lookup time in an unbalanced Binary Search Tree?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 2, exp: "A skewed binary search tree behaves like a linked list, requiring O(N) linear scan." },
  { q: "What is a Trie (Prefix Tree) best suited for?", opts: ["Floating point calculations", "Fast prefix lookups, autocomplete, and dictionary search for strings", "Matrix multiplication", "Heap operations"], ans: 1, exp: "Tries store characters along branch paths, enabling O(L) string search where L is string length." },
  { q: "What is the two-pointer technique frequently used for?", opts: ["Managing CPU cores", "Searching pairs in sorted arrays or finding palindromes in O(N) time", "Compiling shaders", "Binary tree rotation"], ans: 1, exp: "Two pointers converging from ends or moving at different speeds avoid nested O(N^2) loops." },
  { q: "What does Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detect?", opts: ["Tree balance", "Loops/cycles in a linked list using slow and fast pointers", "Network packets", "Array duplicates in O(1)"], ans: 1, exp: "Slow (1x) and fast (2x) pointers are guaranteed to intersect if a cycle exists in a linked list." },
  { q: "What is the space complexity of recursive DFS on a binary tree of height H?", opts: ["O(1)", "O(H)", "O(2^H)", "O(N^2)"], ans: 1, exp: "The call stack consumes memory proportional to tree height H." },
  { q: "What is counting sort's time complexity for n items with range k?", opts: ["O(n^2)", "O(n + k)", "O(n log k)", "O(k^2)"], ans: 1, exp: "Counting sort counts frequencies in O(n + k) non-comparison linear time." }
];

const dsaHard = [
  { q: "What is the amortized time complexity of operations in a Splay Tree?", opts: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], ans: 1, exp: "Splay trees guarantee amortized O(log N) time per operation via splay restructuring." },
  { q: "How does a Red-Black Tree maintain balance compared to an AVL Tree?", opts: ["It requires exact height balance", "It enforces 5 color properties (e.g. no two red nodes adjacent) allowing faster insertions with fewer rotations", "It has 3 children per node", "It is unbalanced"], ans: 1, exp: "Red-black trees are looser balanced than AVL, trading slightly slower lookups for faster write updates." },
  { q: "What is the time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm for text N and pattern M?", opts: ["O(N * M)", "O(N + M)", "O(N log M)", "O(2^N)"], ans: 1, exp: "KMP precomputes a Longest Prefix Suffix (LPS) array to avoid backtracking, achieving O(N + M) linear time." },
  { q: "What is the A* (A-Star) search algorithm's evaluation function formula?", opts: ["f(n) = g(n) + h(n) where g is exact cost and h is heuristic estimate", "f(n) = g(n) * h(n)", "f(n) = max(g(n), h(n))", "f(n) = h(n) / 2"], ans: 0, exp: "A* combines path cost g(n) with an admissible heuristic h(n) to guarantee optimal pathfinding." },
  { q: "What makes a heuristic 'admissible' in A* search?", opts: ["It never underestimates cost", "It never overestimates the true remaining cost to the goal", "It is negative", "It returns integers only"], ans: 1, exp: "Admissible heuristics guarantee A* will find the mathematically shortest path." },
  { q: "What is the time complexity of the Bellman-Ford algorithm on graph with V vertices and E edges?", opts: ["O(V + E)", "O(V * E)", "O(E log V)", "O(V^3)"], ans: 1, exp: "Bellman-Ford relaxes all E edges V-1 times, operating in O(V * E) and detecting negative cycles." },
  { q: "What is a Segment Tree primarily used for?", opts: ["Rendering 3D graphics", "Range queries (sum, min, max) and point updates in O(log N) time", "Sorting strings", "Hashing passwords"], ans: 1, exp: "Segment trees partition arrays into binary intervals to answer range queries in O(log N)." },
  { q: "What does the Tarjan's algorithm compute on a directed graph in linear time O(V + E)?", opts: ["Minimum Spanning Tree", "Strongly Connected Components (SCCs)", "Topological sorting of cyclic graphs", "Shortest path"], ans: 1, exp: "Tarjan's algorithm uses DFS traversal with low-link values to identify SCCs in O(V + E)." },
  { q: "What is the theoretical lower bound time complexity for any comparison-based sorting algorithm on N items?", opts: ["O(N)", "Omega(N log N)", "O(N^2)", "O(log N)"], ans: 1, exp: "A decision tree of N! permutations requires at least log2(N!) = Omega(N log N) comparisons." },
  { q: "How does a B+ Tree differ from a standard B Tree in database indexing?", opts: ["B+ trees have no leaf nodes", "B+ trees store all data records exclusively in leaf nodes linked sequentially, while internal nodes store only routing keys", "B+ trees store strings only", "B+ trees cannot balance"], ans: 1, exp: "B+ trees concentrate data in linked leaf nodes for rapid range scans and dense cache-friendly branch keys." }
];

export const DSA_MCQS = createTopicQuestions('dsa', 'Data Structures & Algorithms', dsaEasy, dsaMedium, dsaHard);

// 4. SQL & Database Systems (50 questions: 15 Easy, 25 Medium, 10 Hard)
const sqlEasy = [
  { q: "What does SQL stand for?", opts: ["Simple Query Language", "Structured Query Language", "Standard Quality Log", "Sequential Query Library"], ans: 1, exp: "SQL stands for Structured Query Language, the standard for relational databases." },
  { q: "Which SQL clause is used to filter records based on a condition?", opts: ["ORDER BY", "WHERE", "GROUP BY", "SELECT"], ans: 1, exp: "WHERE filters rows based on a boolean condition." },
  { q: "Which command retrieves data from a database table?", opts: ["GET", "FETCH", "SELECT", "PULL"], ans: 2, exp: "SELECT queries and returns data from tables." },
  { q: "Which SQL keyword is used to return only distinct (different) values?", opts: ["UNIQUE", "DISTINCT", "DIFFERENT", "ISOLATE"], ans: 1, exp: "SELECT DISTINCT eliminates duplicate rows from results." },
  { q: "How do you sort the result set in ascending order by default in SQL?", opts: ["SORT ASC", "ORDER BY column", "GROUP BY column", "ARRANGE column"], ans: 1, exp: "ORDER BY sorts ascending (ASC) by default." },
  { q: "Which SQL command adds a new row to a table?", opts: ["INSERT INTO", "ADD ROW", "APPEND", "NEW RECORD"], ans: 0, exp: "INSERT INTO table VALUES (...) inserts new tuples." },
  { q: "Which command modifies existing data within a table?", opts: ["MODIFY", "UPDATE", "CHANGE", "SAVE"], ans: 1, exp: "UPDATE table SET col = val WHERE condition alters existing rows." },
  { q: "Which SQL command deletes data from a table?", opts: ["REMOVE", "DELETE FROM", "DROP ROW", "CLEAR"], ans: 1, exp: "DELETE FROM removes specified rows matching WHERE." },
  { q: "What does a PRIMARY KEY constraint enforce?", opts: ["Columns can have duplicates", "Unique identification for each row and prohibits NULL values", "Encrypts column data", "Sorts table alphabetically"], ans: 1, exp: "Primary keys guarantee uniqueness and non-nullability." },
  { q: "What is a FOREIGN KEY in a relational database?", opts: ["A key from an external server", "A field in one table that refers to the PRIMARY KEY in another table to enforce referential integrity", "A secret password", "A secondary index"], ans: 1, exp: "Foreign keys link related records and enforce referential integrity." },
  { q: "Which aggregate function calculates the total sum of a numeric column?", opts: ["TOTAL()", "SUM()", "COUNT()", "AVG()"], ans: 1, exp: "SUM() aggregates the numerical total of rows." },
  { q: "Which SQL aggregate function counts the number of rows?", opts: ["NUM()", "ROWS()", "COUNT()", "TALLY()"], ans: 2, exp: "COUNT(*) returns the count of matching records." },
  { q: "What does NULL represent in SQL?", opts: ["Number zero", "Empty string", "Missing or unknown value", "Boolean false"], ans: 2, exp: "NULL represents absence of data, distinct from zero or empty string." },
  { q: "How do you select all columns from a table named 'Students'?", opts: ["SELECT ALL FROM Students;", "SELECT * FROM Students;", "GET * FROM Students;", "TABLE Students;"], ans: 1, exp: "SELECT * returns all columns in the queried table." },
  { q: "Which keyword removes a table and its entire schema from the database?", opts: ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE", "TRUNCATE"], ans: 1, exp: "DROP TABLE permanently deletes the table structure and its rows." }
];

const sqlMedium = [
  { q: "What is the difference between INNER JOIN and LEFT JOIN?", opts: ["They are identical", "INNER JOIN returns matching rows from both tables; LEFT JOIN returns all rows from the left table plus matching rows from the right", "LEFT JOIN only returns left columns", "INNER JOIN is faster always"], ans: 1, exp: "LEFT JOIN preserves all records from the left table even if no match exists on the right." },
  { q: "What is the purpose of the GROUP BY clause?", opts: ["Orders the table", "Collapses rows that have the same values into summary rows with aggregate functions", "Creates multiple tables", "Groups users by role"], ans: 1, exp: "GROUP BY partitions data into groups for aggregate functions (SUM, AVG, COUNT)." },
  { q: "What is the difference between WHERE and HAVING?", opts: ["WHERE filters groups; HAVING filters rows", "WHERE filters individual rows before grouping; HAVING filters aggregate groups after GROUP BY", "HAVING is for SQLite only", "WHERE cannot use numbers"], ans: 1, exp: "HAVING filters groups post-aggregation; WHERE filters individual tuples pre-aggregation." },
  { q: "What are the ACID properties in database transactions?", opts: ["Action, Consistency, Index, Data", "Atomicity, Consistency, Isolation, Durability", "Access, Control, Identity, Direct", "Async, Concurrent, Isolated, Distributed"], ans: 1, exp: "ACID guarantees transactional reliability in relational DBMS." },
  { q: "What does 'Atomicity' guarantee in a transaction?", opts: ["Transactions run fast", "All operations within the transaction succeed completely, or none do (All or Nothing rollback)", "Data is encrypted", "Tables cannot be locked"], ans: 1, exp: "Atomicity ensures incomplete transactions are rolled back completely upon failure." },
  { q: "What does an INDEX do in a database?", opts: ["Encrypts passwords", "Creates a data structure (like B-Tree) to rapidly locate rows without scanning the full table", "Backs up data daily", "Orders columns physically"], ans: 1, exp: "Indexes accelerate query retrieval at the expense of additional write overhead." },
  { q: "What is a downside of having too many indexes on a table?", opts: ["Queries become impossible", "Slows down INSERT, UPDATE, and DELETE operations due to index maintenance overhead", "Tables become read-only", "Database deletes data"], ans: 1, exp: "Every write operation must update all auxiliary index trees." },
  { q: "What is First Normal Form (1NF)?", opts: ["Each table has 1 column", "All column values must be atomic (indivisible) and each record must be unique", "Tables must have foreign keys", "Data is stored as JSON"], ans: 1, exp: "1NF requires atomic attribute values and eliminates repeating groups." },
  { q: "What does Second Normal Form (2NF) require beyond 1NF?", opts: ["Must be in 1NF and eliminate partial dependency (non-key attributes must depend on the whole primary key)", "Must have indexes", "No foreign keys", "Must be encrypted"], ans: 0, exp: "2NF eliminates partial functional dependencies on composite candidate keys." },
  { q: "What does Third Normal Form (3NF) require beyond 2NF?", opts: ["Tables must have 3 columns", "Must be in 2NF and eliminate transitive functional dependencies", "Must use UUIDs", "Must run in memory"], ans: 1, exp: "3NF ensures non-key attributes depend only on the key and nothing but the key." },
  { q: "What does the TRUNCATE TABLE command do compared to DELETE?", opts: ["It is slower than DELETE", "Quickly removes all rows by deallocating pages with minimal logging, without firing row-level triggers", "Deletes the table schema", "Requires WHERE clause"], ans: 1, exp: "TRUNCATE is a DDL operation that resets identity seeds and empties the table rapidly." },
  { q: "What is a subquery (nested query)?", opts: ["A query written in Python", "A query embedded within the WHERE, FROM, or SELECT clause of another SQL statement", "A comment in SQL", "A transaction commit"], ans: 1, exp: "Subqueries provide dynamic intermediate results to outer enclosing queries." },
  { q: "What is the difference between UNION and UNION ALL?", opts: ["UNION preserves duplicates; UNION ALL removes duplicates", "UNION removes duplicate rows (requiring a distinct sort); UNION ALL retains all duplicates", "UNION is for numbers only", "They are identical"], ans: 1, exp: "UNION ALL combines sets directly without the performance overhead of duplicate elimination." },
  { q: "What does the LIKE operator '%test_' match?", opts: ["Any string containing 'test'", "Any string ending with 'test' followed by exactly one character", "Strings starting with 'test'", "Only 'test'"], ans: 1, exp: "% matches zero or more characters; _ matches exactly one single character." },
  { q: "What is a Database View?", opts: ["A physical copy of the database", "A virtual table based on the result-set of a predefined SQL query", "A backup snapshot", "A GUI admin tool"], ans: 1, exp: "Views provide simplified, secure virtual query representations without duplicating underlying data." },
  { q: "What is a Stored Procedure?", opts: ["A hardware disk drive", "A prepared SQL code routine saved in the database that can be reused with parameters", "A backup file", "A table trigger"], ans: 1, exp: "Stored procedures encapsulate business logic and reduce network traffic." },
  { q: "What is a Database Trigger?", opts: ["A button in the UI", "A procedure that automatically executes in response to specified database events (INSERT, UPDATE, DELETE)", "A foreign key error", "A query timeout"], ans: 1, exp: "Triggers execute automatically upon defined table mutation events." },
  { q: "What does the COALESCE() function return?", opts: ["The sum of numbers", "The first non-null expression in its argument list", "The current timestamp", "A boolean"], ans: 1, exp: "COALESCE(val1, val2, ...) evaluates sequentially and returns the first non-NULL value." },
  { q: "What does the SQL command 'ROLLBACK' do?", opts: ["Restores table structure", "Reverts all modifications made during the current uncommitted transaction", "Restarts the database server", "Deletes the last table"], ans: 1, exp: "ROLLBACK aborts the transaction, reverting state to the previous checkpoint/commit." },
  { q: "What does the clause 'OFFSET 10 ROWS FETCH NEXT 5 ROWS ONLY' accomplish?", opts: ["Selects 15 rows", "Skips the first 10 rows and returns the next 5 rows (Pagination)", "Deletes 10 rows", "Duplicates rows 5 times"], ans: 1, exp: "OFFSET/FETCH enables database-level pagination." },
  { q: "What is an outer join that returns all rows from both tables whether they match or not?", opts: ["INNER JOIN", "CROSS JOIN", "FULL OUTER JOIN", "LEFT JOIN"], ans: 2, exp: "FULL OUTER JOIN unions left and right joins, populating NULLs for non-matches." },
  { q: "What is a CROSS JOIN?", opts: ["A join on identical columns", "The Cartesian product of two tables pairing every row of table A with every row of table B", "A self-join", "A foreign key check"], ans: 1, exp: "CROSS JOIN produces A x B rows containing all possible combinations." },
  { q: "What does the SQL 'CASE' statement provide?", opts: ["Changes lowercase to uppercase", "Conditional IF-THEN-ELSE evaluation within a query", "Switch user role", "Database backups"], ans: 1, exp: "CASE WHEN condition THEN val ELSE default END enables conditional projections." },
  { q: "What is the result of 'SELECT 1 WHERE NULL = NULL;'?", opts: ["1", "Empty result set (NULL comparison requires IS NULL)", "Error", "False"], ans: 1, exp: "In ANSI SQL, three-valued logic treats NULL = NULL as UNKNOWN, filtering the row." },
  { q: "What is the difference between CHAR(10) and VARCHAR(10)?", opts: ["CHAR is variable length; VARCHAR is fixed", "CHAR pads with spaces to fixed 10 characters; VARCHAR uses variable length up to 10", "VARCHAR is numbers only", "They are identical"], ans: 1, exp: "CHAR allocates fixed length storage; VARCHAR stores actual character bytes plus a length prefix." }
];

const sqlHard = [
  { q: "What are the four ANSI SQL transaction isolation levels in order of increasing isolation?", opts: ["Read Uncommitted, Read Committed, Repeatable Read, Serializable", "Serializable, Repeatable Read, Read Committed, Read Uncommitted", "Low, Medium, High, Extreme", "None, Basic, Advanced, Strict"], ans: 0, exp: "Serializable is the highest isolation level, preventing dirty reads, non-repeatable reads, and phantom reads." },
  { q: "What is a 'Phantom Read' anomaly?", opts: ["A crashed server query", "When a transaction re-executes a range query and discovers new rows inserted by another concurrent committed transaction", "Reading deleted data", "A corrupted index read"], ans: 1, exp: "Phantom reads occur when concurrent transactions insert qualifying rows into an active range." },
  { q: "What is a Window Function in SQL (e.g. ROW_NUMBER() OVER (...))?", opts: ["A function that creates GUI windows", "Performs calculations across a set of table rows related to the current row without collapsing them into a single output row", "A browser API", "A loop in stored procedures"], ans: 1, exp: "Window functions compute rankings, running totals, and moving averages while preserving row identity." },
  { q: "What is the difference between RANK() and DENSE_RANK()?", opts: ["RANK does not allow ties", "RANK skips subsequent rank numbers after ties (1, 1, 3); DENSE_RANK assigns consecutive ranks without gaps (1, 1, 2)", "DENSE_RANK is slower", "They are identical"], ans: 1, exp: "DENSE_RANK maintains sequential rankings without numerical gaps following tie ties." },
  { q: "What is a Common Table Expression (CTE) defined with 'WITH'?", opts: ["A temporary table written to physical disk", "A named temporary result set that exists only within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE", "A global variable", "A database cluster"], ans: 1, exp: "CTEs modularize complex queries and enable recursive hierarchical tree querying." },
  { q: "How does a Recursive CTE process hierarchical data (like org charts)?", opts: ["Runs a while loop in memory", "Executes an anchor query combined via UNION ALL with a recursive member until an empty set is produced", "Uses Python recursion", "Iterates over disk pages"], ans: 1, exp: "Recursive CTEs evaluate an anchor member followed by iterative self-joins." },
  { q: "What is Write-Ahead Logging (WAL) in database engines?", opts: ["Writing logs to paper", "Ensuring data mutations are safely appended to non-volatile log files before modifying actual table data pages", "Logging user IP addresses", "A debugging tool"], ans: 1, exp: "WAL guarantees durability and recovery by persisting transactions to sequential logs before disk page flushes." },
  { q: "What is a Composite Index and what is the 'Leftmost Prefix Rule'?", opts: ["An index on 1 column", "An index spanning multiple columns (A, B, C); queries can utilize it only if conditions match leading columns from the left (A or A, B)", "An index on the left side of the table", "A reverse index"], ans: 1, exp: "Queries filtering on (B, C) without (A) cannot utilize a composite index on (A, B, C)." },
  { q: "What is Deadlock in a database and how is it resolved?", opts: ["A broken cable", "Two transactions each waiting for locks held by the other in a circular wait; resolved by the engine aborting one as a victim", "A full disk", "A deleted table"], ans: 1, exp: "Engines detect circular wait lock cycles and rollback one transaction to break the deadlock." },
  { q: "What is Database Sharding?", opts: ["Backing up databases", "Horizontal partitioning that separates rows of a large database across multiple independent physical server instances", "Compressing tables", "Converting SQL to NoSQL"], ans: 1, exp: "Sharding distributes database partitions across nodes via a shard key to scale throughput." }
];

export const SQL_MCQS = createTopicQuestions('sql', 'SQL & Database Systems', sqlEasy, sqlMedium, sqlHard);

// 5. Machine Learning Question Set (15 Easy, 25 Medium, 10 Hard = 50)
const mlEasy = [
  { q: "What is Supervised Learning?", opts: ["Learning without any input data", "Training a model on labeled data where input features map to ground-truth target outputs", "Clustering unlabeled items", "Learning through rewards"], ans: 1, exp: "Supervised learning algorithms infer a mapping function from labeled training data." },
  { q: "What is Unsupervised Learning?", opts: ["Training with teacher supervision", "Discovering inherent patterns, groupings, or clusters in unlabeled data without target outputs", "Supervised learning in the cloud", "Writing rules manually"], ans: 1, exp: "Unsupervised learning identifies clusters, latent representations, or associations without labels." },
  { q: "What is the difference between Classification and Regression?", opts: ["Classification predicts continuous numbers; Regression predicts categories", "Classification predicts discrete categories; Regression predicts continuous numerical values", "They are identical", "Classification is only for images"], ans: 1, exp: "Classification predicts discrete class labels; regression predicts real-valued continuous quantities." },
  { q: "Which metric measures the fraction of correct predictions over total predictions?", opts: ["Precision", "Accuracy", "Recall", "Mean Squared Error"], ans: 1, exp: "Accuracy = (True Positives + True Negatives) / Total Samples." },
  { q: "What is 'Overfitting' in machine learning?", opts: ["Model performs poorly on training data", "Model learns training noise and details so closely that it fails to generalize to unseen test data", "Model trains too fast", "Model has too few parameters"], ans: 1, exp: "Overfitting occurs when a complex model memorizes training noise at the expense of generalization." },
  { q: "What is 'Underfitting'?", opts: ["Model memorizes test data", "Model is too simple to capture underlying patterns in the training data, performing poorly on both train and test sets", "Model has 100% accuracy", "Training takes too long"], ans: 1, exp: "Underfitting occurs when high bias prevents the model from capturing feature relationships." },
  { q: "Which algorithm uses a decision tree structure for prediction?", opts: ["Linear Regression", "Decision Tree", "K-Means", "PCA"], ans: 1, exp: "Decision trees recursively partition features into branching decision nodes." },
  { q: "What does 'Train-Test Split' accomplish?", opts: ["Splits data into train and test sets to evaluate generalization on unseen data", "Deletes half the dataset", "Compresses file sizes", "Separates numbers from strings"], ans: 0, exp: "Withholding test data provides an unbiased evaluation of model performance." },
  { q: "What is K-Means algorithm used for?", opts: ["Supervised classification", "Unsupervised clustering of data into K groups", "Natural language translation", "Sorting arrays"], ans: 1, exp: "K-Means partitions observations into K clusters based on Euclidean distance to centroids." },
  { q: "What does 'Feature' mean in machine learning?", opts: ["A bug in the model", "An individual measurable variable or property used as input for prediction", "A marketing description", "A GPU component"], ans: 1, exp: "Features are the independent input variables (X) fed into models." },
  { q: "What is a 'Target' or 'Label' in supervised learning?", opts: ["The database name", "The ground-truth variable or outcome the model aims to predict (Y)", "A programming keyword", "The server endpoint"], ans: 1, exp: "The target is the dependent ground-truth variable the algorithm learns to predict." },
  { q: "Which library is the standard Python package for traditional machine learning?", opts: ["Flask", "Scikit-learn", "Django", "NumPy only"], ans: 1, exp: "Scikit-learn provides algorithms for classification, regression, clustering, and preprocessing." },
  { q: "What is Mean Squared Error (MSE) used to evaluate?", opts: ["Classification accuracy", "Regression model prediction errors", "Clustering purity", "NLP sentiment"], ans: 1, exp: "MSE measures the average squared difference between estimated values and actual values." },
  { q: "What is the purpose of Data Normalization (Scaling)?", opts: ["To convert text to numbers", "To bring different feature scales into a uniform range (e.g. 0 to 1) so large values do not dominate", "To remove outliers", "To speed up internet"], ans: 1, exp: "Scaling prevents features with large numeric magnitudes from dominating gradient descent and distance metrics." },
  { q: "What is Reinforcement Learning based on?", opts: ["Static spreadsheets", "An agent taking actions in an environment to maximize cumulative reward through trial and error", "Unsupervised clustering", "Pre-labeled CSV files"], ans: 1, exp: "Reinforcement learning optimizes policy actions through feedback rewards and penalties." }
];

const mlMedium = [
  { q: "What is the Bias-Variance Tradeoff?", opts: ["Speed vs Accuracy", "Balancing underfitting error (high bias) against overfitting error (high variance) to minimize total test error", "Cost vs RAM", "CPU vs GPU"], ans: 1, exp: "Total error is the sum of Bias^2 + Variance + Irreducible Error." },
  { q: "In binary classification, what is Precision?", opts: ["True Positives / (True Positives + False Negatives)", "True Positives / (True Positives + False Positives)", "Total correct / total samples", "True Negatives / total samples"], ans: 1, exp: "Precision measures of all predicted positives, how many were truly positive." },
  { q: "In binary classification, what is Recall (Sensitivity)?", opts: ["True Positives / (True Positives + False Positives)", "True Positives / (True Positives + False Negatives)", "False Positives / total samples", "Accuracy squared"], ans: 1, exp: "Recall measures of all actual ground-truth positives, how many were correctly detected." },
  { q: "What is the F1-Score?", opts: ["Arithmetic mean of Precision and Recall", "Harmonic mean of Precision and Recall: 2 * (P * R) / (P + R)", "Geometric mean of Accuracy", "Ratio of True Positives to False Negatives"], ans: 1, exp: "The F1-score balances precision and recall, especially on imbalanced datasets." },
  { q: "Why is Accuracy often misleading on imbalanced datasets (e.g. 99% negative fraud data)?", opts: ["It causes division by zero", "A naive model predicting 'Negative' always achieves 99% accuracy while detecting zero actual fraud cases", "Accuracy cannot be calculated", "It runs too slow"], ans: 1, exp: "Trivial majority-class prediction yields high accuracy despite failing the core objective." },
  { q: "What does the ROC-AUC score measure?", opts: ["Model training speed", "The area under the Receiver Operating Characteristic curve plotting True Positive Rate against False Positive Rate across all thresholds", "The number of trees in a forest", "Memory consumption"], ans: 1, exp: "ROC-AUC evaluates ranking discrimination independent of arbitrary classification thresholds." },
  { q: "What is Cross-Validation (e.g. K-Fold)?", opts: ["Validating code with a linter", "Splitting data into K folds, training on K-1 and testing on the remaining fold iteratively to ensure robust evaluation", "Testing data in another programming language", "Running code on 2 machines"], ans: 1, exp: "K-fold cross-validation averages performance across K iterations to reduce split bias." },
  { q: "What is L1 Regularization (Lasso)?", opts: ["Adds sum of squared weights to loss", "Adds absolute magnitude of coefficients to loss penalty (|w|), driving irrelevant weights to exact zero for feature selection", "Removes missing data", "Double learning rate"], ans: 1, exp: "L1 regularization induces sparsity by driving unimportant weights to 0." },
  { q: "What is L2 Regularization (Ridge)?", opts: ["Adds sum of absolute weights", "Adds squared magnitude of coefficients to loss penalty (w^2), shrinking weights toward zero without forcing exact zero", "Multiplies data by 2", "Removes outliers"], ans: 1, exp: "L2 penalizes large weights proportionally, mitigating multicollinearity." },
  { q: "How does a Random Forest work?", opts: ["A single very deep decision tree", "An ensemble of decision trees trained on bootstrapped subsets with random feature subsampling (Bagging)", "A neural network with forest layers", "A linear regression variant"], ans: 1, exp: "Random Forest combines bagging and feature randomness to reduce variance." },
  { q: "What is Gradient Boosting (e.g. XGBoost, LightGBM)?", opts: ["Training trees independently in parallel", "Ensemble technique where trees are trained sequentially, each tree correcting the residual errors of the previous trees", "A clustering algorithm", "A linear solver"], ans: 1, exp: "Boosting builds sequential weak learners that minimize the gradient of the loss function." },
  { q: "What is the purpose of One-Hot Encoding?", opts: ["Encrypting data", "Converting categorical strings into binary indicator columns (0s and 1s) without imposing ordinal hierarchy", "Compressing files", "Normalizing floats"], ans: 1, exp: "One-hot encoding represents nominal categories as orthogonal binary vectors." },
  { q: "What is Principal Component Analysis (PCA) used for?", opts: ["Classification", "Unsupervised dimensionality reduction by finding orthogonal axes of maximum variance", "Model evaluation", "Hyperparameter tuning"], ans: 1, exp: "PCA projects high-dimensional data onto lower-dimensional principal components preserving variance." },
  { q: "What does the Learning Rate parameter control in Gradient Descent?", opts: ["The number of epochs", "The step size taken in the direction of the negative gradient at each optimization iteration", "The batch size", "The regularization strength"], ans: 1, exp: "Learning rate dictates the magnitude of parameter updates per step." },
  { q: "What is the consequence of setting the learning rate too high in Gradient Descent?", opts: ["Model trains instantly", "The optimizer may oscillate, diverge, or overshoot the local/global minimum entirely", "Loss becomes zero", "GPU turns off"], ans: 1, exp: "Excessive step sizes cause divergent instability." },
  { q: "What is Data Leakage in machine learning?", opts: ["A hacker stealing files", "When information from the test/target set unintentionally contaminates training data, creating artificially high scores that fail in production", "Memory leaks in Python", "Missing values"], ans: 1, exp: "Data leakage introduces lookahead or test distribution signals into training." },
  { q: "What is the difference between Bagging and Boosting?", opts: ["They are identical", "Bagging trains parallel models independently to reduce variance; Boosting trains sequential models iteratively to reduce bias", "Bagging is for regression only", "Boosting is unsupervised"], ans: 1, exp: "Bagging reduces variance via averaging; Boosting reduces bias via sequential residual fitting." },
  { q: "What is the Support Vector in Support Vector Machines (SVM)?", opts: ["A server supporting the code", "Data points that lie closest to the decision boundary hyperplane that dictate the margin", "The bias term", "A kernel function"], ans: 1, exp: "Support vectors are the critical edge samples that determine the optimal separating margin." },
  { q: "What does the 'Kernel Trick' do in SVM?", opts: ["Hacks the operating system", "Implicitly maps non-linearly separable data into higher-dimensional space without calculating coordinates explicitly", "Speeds up disk I/O", "Converts data to text"], ans: 1, exp: "Kernel functions compute inner products in high-dimensional feature space directly." },
  { q: "What is an Epoch in model training?", opts: ["A single sample pass", "One complete pass of the entire training dataset through the model", "One second of training", "A convergence test"], ans: 1, exp: "An epoch signifies that every training sample has been seen once." },
  { q: "What is Batch Size in deep learning / machine learning?", opts: ["The total size of the hard drive", "The number of training samples processed before updating internal model parameters", "The count of features", "The number of layers"], ans: 1, exp: "Batch size specifies the subset of examples evaluated per gradient step." },
  { q: "What is early stopping in model training?", opts: ["Halting training when model loss on validation data starts increasing, preventing overfitting", "Stopping when computer battery is low", "Interrupting with Ctrl+C", "Training for 1 epoch only"], ans: 0, exp: "Early stopping monitors validation loss to checkpoint the optimal generalization state." },
  { q: "What is the difference between Parametric and Non-Parametric algorithms?", opts: ["Parametric uses parameters in functions; Non-parametric does not", "Parametric models assume a fixed functional form (e.g. Linear Regression); Non-parametric make no strong assumptions and can grow in complexity (e.g. KNN, Trees)", "Parametric is always slower", "Non-parametric cannot train"], ans: 1, exp: "Parametric models summarize data with fixed numbers of parameters; non-parametric flexibility scales with data." },
  { q: "What does the silhouette score measure in clustering?", opts: ["Model training time", "How similar an object is to its own cluster compared to other clusters (-1 to +1)", "The number of clusters", "Accuracy percentage"], ans: 1, exp: "Silhouette score evaluates cluster separation and intra-cluster cohesion." },
  { q: "What is SMOTE (Synthetic Minority Over-sampling Technique)?", opts: ["A classification algorithm", "Technique to balance datasets by generating synthetic examples along feature vectors connecting minority class neighbors", "A feature selection tool", "A database connector"], ans: 1, exp: "SMOTE interpolates synthetic instances between minority samples to mitigate imbalance." }
];

const mlHard = [
  { q: "How does the Vanishing Gradient problem affect deep neural network training?", opts: ["Gradients grow to infinity", "Gradients propagated back through layers become exponentially small, causing early layers to train extremely slowly or stop entirely", "Weights become negative", "Memory leaks occur"], ans: 1, exp: "Repeated multiplication of small derivatives (e.g. sigmoid) shrinks gradients to near-zero in early layers." },
  { q: "Why do modern deep networks prefer ReLU (Rectified Linear Unit) over Sigmoid activations?", opts: ["ReLU has non-saturating derivative of 1 for positive inputs, avoiding vanishing gradients during backpropagation", "ReLU is smoother", "ReLU outputs probabilities", "Sigmoid is illegal in Python"], ans: 0, exp: "ReLU prevents gradient saturation for positive activations and computes efficiently." },
  { q: "How does Batch Normalization accelerate neural network training?", opts: ["Reduces batch size to 1", "Normalizes layer inputs across mini-batches, stabilizing internal covariate shift and smoothing optimization landscapes", "Eliminates backpropagation", "Removes weights"], ans: 1, exp: "Batch normalization stabilizes activation distributions across mini-batches." },
  { q: "What is the difference between Stochastic Gradient Descent (SGD), Mini-batch GD, and Batch GD?", opts: ["They are identical", "Batch uses all data per update; SGD uses 1 sample; Mini-batch uses small subsets (e.g. 32-256) balancing stability and throughput", "SGD is only for images", "Batch GD runs on GPUs only"], ans: 1, exp: "Mini-batch SGD strikes the balance between vectorization throughput and gradient variance." },
  { q: "What does the Adam optimizer combine?", opts: ["Decision trees and linear models", "Momentum (first moment / moving average of gradients) and RMSprop (second moment / moving average of squared gradients)", "L1 and L2 penalty", "Bagging and Boosting"], ans: 1, exp: "Adam maintains adaptive learning rates using exponentially decaying averages of past gradients and squared gradients." },
  { q: "In Transformer architecture, how does Scaled Dot-Product Attention scale with sequence length N?", opts: ["O(N)", "O(N^2) quadratic complexity in both time and memory", "O(log N)", "O(1)"], ans: 1, exp: "The attention matrix computed between all pairs of N query and key tokens scales as O(N^2)." },
  { q: "What is the purpose of the Temperature parameter in LLM token sampling?", opts: ["Controls GPU heat", "Divides logits before softmax; lower temperature concentrates probability on top tokens, higher temperature flattens distribution for creativity", "Controls network bandwidth", "Sets context window"], ans: 1, exp: "Temperature scales logit magnitudes before softmax to regulate randomness." },
  { q: "What is the difference between Cross-Entropy Loss and Mean Squared Error for classification?", opts: ["They are mathematically equivalent", "Cross-entropy strongly penalizes confident incorrect predictions based on log probabilities, producing steeper gradients", "MSE is always preferred for softmax", "Cross-entropy is for regression only"], ans: 1, exp: "Cross-entropy aligns with maximum likelihood estimation for categorical distributions." },
  { q: "What is Concept Drift in production machine learning systems?", opts: ["The code changes in git", "Statistical properties of the target variable or relationships between input features and targets change over time", "The server moves to another region", "Data types change"], ans: 1, exp: "Concept drift occurs when real-world underlying dynamics shift, degrading static model performance." },
  { q: "What does the SHAP (SHapley Additive exPlanations) framework calculate?", opts: ["Neural network latency", "Game-theoretic Shapley values measuring the marginal contribution of each feature to an individual prediction", "Random forest depth", "Database query execution plan"], ans: 1, exp: "SHAP provides theoretically grounded local and global feature attribution interpretations." }
];

export const ML_MCQS = createTopicQuestions('ml', 'Machine Learning', mlEasy, mlMedium, mlHard);

// 6. Full Stack Web Development (50 questions: 15 Easy, 25 Medium, 10 Hard)
const webEasy = [
  { q: "What does HTML stand for?", opts: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "Home Tool Markup Language"], ans: 0, exp: "HTML is the standard markup language for creating web pages." },
  { q: "What does CSS stand for?", opts: ["Cascading Style Sheets", "Computer Style System", "Creative Styling Sheet", "Colorful Style Sheets"], ans: 0, exp: "CSS describes how HTML elements should be styled and displayed." },
  { q: "Which HTML tag is used to create a hyperlink?", opts: ["<link>", "<a>", "<href>", "<url>"], ans: 1, exp: "The <a> (anchor) tag creates hyperlinks." },
  { q: "What is the correct HTML element for inserting an image?", opts: ["<image>", "<img>", "<pic>", "<src>"], ans: 1, exp: "<img src='...' alt='...' /> inserts images." },
  { q: "Which CSS property changes the text color of an element?", opts: ["text-color", "color", "font-color", "text-style"], ans: 1, exp: "The 'color' property sets foreground text color." },
  { q: "Which HTML element is used for the largest heading?", opts: ["<h6>", "<head>", "<h1>", "<heading>"], ans: 2, exp: "<h1> represents the highest level section heading." },
  { q: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?", opts: ["var", "let", "const", "static"], ans: 1, exp: "'let' declares reassignable block-scoped variables." },
  { q: "Which JavaScript keyword declares a block-scoped variable that cannot be reassigned?", opts: ["var", "let", "const", "fixed"], ans: 2, exp: "'const' creates immutable bindings to values." },
  { q: "What is the DOM in web development?", opts: ["Data Object Method", "Document Object Model representing the page structure as a node tree", "Digital Operating Module", "Desktop Origin Mode"], ans: 1, exp: "The DOM is the programming interface for HTML documents." },
  { q: "Which HTTP status code indicates a successful request?", opts: ["200 OK", "404 Not Found", "500 Server Error", "301 Redirect"], ans: 0, exp: "200 OK signals standard success for HTTP requests." },
  { q: "Which HTTP status code indicates that the requested resource was not found?", opts: ["200", "302", "404", "503"], ans: 2, exp: "404 Not Found indicates missing endpoint or file." },
  { q: "What does JSON stand for?", opts: ["JavaScript Object Notation", "Java Server Online Network", "JavaScript Open Node", "Joint System Output Net"], ans: 0, exp: "JSON is a lightweight data-interchange text format." },
  { q: "Which HTTP method is typically used to retrieve data without side effects?", opts: ["POST", "GET", "DELETE", "PUT"], ans: 1, exp: "GET requests are idempotent and read-only." },
  { q: "Which HTTP method is typically used to create a new resource on the server?", opts: ["GET", "POST", "HEAD", "OPTIONS"], ans: 1, exp: "POST sends payloads to create server-side resources." },
  { q: "What is React?", opts: ["A database", "A JavaScript library for building user interfaces with reusable components", "A web server", "A CSS preprocessor"], ans: 1, exp: "React is a component-driven declarative UI library developed by Meta." }
];

const webMedium = [
  { q: "What is the Virtual DOM in React?", opts: ["A browser extension", "An in-memory lightweight representation of the real DOM used to compute efficient diffs before batching updates", "A 3D canvas", "A web worker"], ans: 1, exp: "The Virtual DOM computes minimal reconciliation diffs to avoid slow direct DOM mutations." },
  { q: "What is the purpose of React 'useState' hook?", opts: ["Fetches URLs", "Declares a state variable and updater function to persist values across component re-renders", "Creates context", "Manages local storage"], ans: 1, exp: "useState adds local reactive state to functional components." },
  { q: "What is the React 'useEffect' hook used for?", opts: ["Styling components", "Performing side effects such as data fetching, subscriptions, and DOM mutations", "Defining routes", "Creating Redux stores"], ans: 1, exp: "useEffect synchronizes functional components with external side-effect systems." },
  { q: "What is CORS in web browsers?", opts: ["Computer Operating System", "Cross-Origin Resource Sharing security mechanism restricting cross-origin HTTP requests", "CSS Organization Rule Set", "Content Optimization Router"], ans: 1, exp: "CORS prevents unauthorized domains from accessing API responses via browser fetch." },
  { q: "What is the difference between localStorage and sessionStorage?", opts: ["localStorage holds numbers; sessionStorage holds text", "localStorage data persists until cleared; sessionStorage data clears when the browser tab closes", "They are identical", "sessionStorage stores files"], ans: 1, exp: "sessionStorage lifecycle is bounded by the browser tab session." },
  { q: "What is the purpose of JWT (JSON Web Token)?", opts: ["Compressing images", "Compact, URL-safe means of representing claims securely between client and server via digital signature", "Styling forms", "Database connection pool"], ans: 1, exp: "JWTs carry stateless claims verified via HMAC or RSA signatures." },
  { q: "In CSS Flexbox, what does 'justify-content' control?", opts: ["Alignment along the cross axis", "Alignment and spacing of items along the main axis", "Font size", "Background color"], ans: 1, exp: "justify-content aligns items along the primary flex axis (row or column)." },
  { q: "In CSS Flexbox, what does 'align-items' control?", opts: ["Main axis alignment", "Alignment along the cross axis", "Z-index ordering", "Text line height"], ans: 1, exp: "align-items specifies default alignment for items along the perpendicular cross axis." },
  { q: "What is Event Bubbling in JavaScript?", opts: ["Deleting event listeners", "When an event triggers on an element and successively propagates upward through its ancestors in the DOM tree", "Playing audio on click", "Crashing browser tabs"], ans: 1, exp: "Events bubble up from the target element through parent nodes unless stopPropagation() is called." },
  { q: "What does 'preventDefault()' do on an event?", opts: ["Stops event bubbling", "Prevents the default browser action (such as form submission reloading the page)", "Deletes the button", "Clears form fields"], ans: 1, exp: "preventDefault() cancels standard browser handling for that event." },
  { q: "What is a Promise in JavaScript?", opts: ["A contract with the user", "An object representing the eventual completion (or failure) of an asynchronous operation and its resulting value", "A guarantee against bugs", "A sync loop"], ans: 1, exp: "Promises handle asynchronous flows with .then(), .catch(), or async/await." },
  { q: "What does 'async/await' syntax provide in JavaScript?", opts: ["Runs code on multiple CPU threads", "Syntactic sugar over Promises enabling asynchronous code to read like synchronous code", "Stops execution permanently", "Faster network sockets"], ans: 1, exp: "async/await simplifies Promise chaining into sequential-style code." },
  { q: "What is the Node.js Event Loop?", opts: ["A for-loop in V8", "Single-threaded loop that delegates non-blocking I/O operations to the system kernel and executes callbacks", "A React component", "A database query"], ans: 1, exp: "Node's event loop handles asynchronous non-blocking I/O offloaded to libuv." },
  { q: "What is the difference between '==' and '===' in JavaScript?", opts: ["'==' checks type; '===' checks value", "'==' performs type coercion before comparison; '===' checks strict equality without coercion", "They are identical", "'===' is deprecated"], ans: 1, exp: "Strict equality (===) requires both operands to share the same type and value." },
  { q: "What is a Closure in JavaScript?", opts: ["A closing HTML tag", "A function bundled with references to its surrounding lexical state (scope) even when executed outside that scope", "A finished Promise", "A private class"], ans: 1, exp: "Closures give functions access to outer scope variables even after the outer function has returned." },
  { q: "What is the purpose of React 'props'?", opts: ["Internal state", "Read-only arguments passed from parent components to child components to configure them", "Database queries", "Global store"], ans: 1, exp: "Props pass data and callbacks downward along the component hierarchy." },
  { q: "Why must list items in React have a unique 'key' prop?", opts: ["For CSS styling", "To help React identify which items have changed, been added, or removed during reconciliation diffing", "Keys are required by HTML", "To sort the array"], ans: 1, exp: "Keys maintain component identity across renders, preventing incorrect re-renders." },
  { q: "What is RESTful API architectural constraint 'Statelessness'?", opts: ["Servers cannot have databases", "Each request from client to server must contain all information needed to understand and process the request without session context stored on server", "Clients cannot send headers", "Responses must be XML"], ans: 1, exp: "Statelessness requires each request to be self-contained." },
  { q: "What is the difference between PUT and PATCH HTTP methods?", opts: ["PUT is read-only", "PUT replaces the entire resource; PATCH applies partial modifications to a resource", "PATCH deletes items", "They are identical"], ans: 1, exp: "PUT performs complete resource replacement; PATCH performs partial delta updates." },
  { q: "What is Cross-Site Scripting (XSS)?", opts: ["Running CSS across sites", "Security vulnerability where malicious scripts are injected into trusted websites and executed in other users' browsers", "Network DDoS attack", "SQL injection variant"], ans: 1, exp: "XSS executes untrusted attacker scripts in victim browser sessions." },
  { q: "What is Cross-Site Request Forgery (CSRF)?", opts: ["Stealing server CPU", "Tricking an authenticated user into executing unauthorized actions on a web application where they are currently authenticated", "Password cracking", "Intercepting Wi-Fi"], ans: 1, exp: "CSRF exploits ambient cookie authentication to perform unauthorized state mutations." },
  { q: "What does the 'npm' package manager do?", opts: ["Compiles C++", "Manages dependencies, scripts, and package distribution for Node.js projects", "Runs web browsers", "Hosts domain names"], ans: 1, exp: "Node Package Manager handles installation and versioning of JavaScript dependencies." },
  { q: "What is CSS Grid best suited for compared to Flexbox?", opts: ["One-dimensional layouts", "Two-dimensional layouts controlling both rows and columns simultaneously", "Animating SVGs", "Text styling"], ans: 1, exp: "CSS Grid excels at 2D grid systems; Flexbox excels at 1D flex flows." },
  { q: "What does 'rem' unit in CSS represent?", opts: ["Relative to element font size", "Relative to root HTML element's font size (typically 16px)", "Real millimeters", "Random pixels"], ans: 1, exp: "1rem equals the computed font-size of the root <html> tag." },
  { q: "What is Server-Side Rendering (SSR) compared to Client-Side Rendering (CSR)?", opts: ["SSR only works offline", "SSR generates HTML on the server per request, sending full HTML to the browser for faster initial load and better SEO", "CSR is faster on 3G", "SSR cannot use JavaScript"], ans: 1, exp: "SSR produces pre-rendered HTML on the server before client hydration." }
];

const webHard = [
  { q: "How do React Server Components (RSC) differ from traditional SSR components?", opts: ["They run in WebAssembly", "RSC execute exclusively on the server, streaming UI tree JSON without sending component code to client bundle", "They replace HTML", "They cannot fetch data"], ans: 1, exp: "RSC components stay on the server, resulting in 0 client-side bundle weight for component logic." },
  { q: "What is the browser Event Loop's Microtask Queue vs Macrotask (Callback) Queue priority?", opts: ["Macrotasks execute first", "Microtasks (Promises, queueMicrotask) execute completely before the next Macrotask (setTimeout, I/O) is processed", "They alternate 50/50", "Microtasks run in background threads"], ans: 1, exp: "The microtask queue drains fully after every macrotask before yielding to the next macrotask or rendering." },
  { q: "What is the purpose of Content Security Policy (CSP) HTTP header?", opts: ["Compresses page size", "Restricts resource origins (scripts, images, stylesheets) that the browser is allowed to load, mitigating XSS attacks", "Caches static assets", "Enables HTTPS"], ans: 1, exp: "CSP headers restrict executable script domains and disallow inline eval to neutralize XSS." },
  { q: "How does the 'stale-while-revalidate' HTTP Cache-Control directive work?", opts: ["Never caches data", "Serves cached stale data immediately while asynchronously fetching an updated version in the background for next time", "Revalidates on every keystroke", "Deletes cache every hour"], ans: 1, exp: "stale-while-revalidate provides instant cached responses while background revalidating." },
  { q: "What does the 'HttpOnly' flag on a cookie prevent?", opts: ["Prevents transmission over HTTPS", "Prevents client-side JavaScript (e.g. document.cookie) from accessing the cookie, mitigating token theft via XSS", "Expires cookie in 1 minute", "Allows cross-domain sharing"], ans: 1, exp: "HttpOnly cookies are inaccessible to document.cookie in browser scripts." },
  { q: "What is WebAssembly (Wasm)?", opts: ["A CSS framework", "A binary instruction format for a stack-based virtual machine, enabling near-native speed execution of C++/Rust in browsers", "A replacement for HTML", "A cloud server"], ans: 1, exp: "Wasm runs high-performance compiled binary modules inside modern web engines." },
  { q: "How does Tree Shaking reduce frontend bundle size in tools like Rollup/Webpack?", opts: ["Compresses images", "Eliminates dead, unused code from exported modules via static ES6 import/export analysis", "Removes comments only", "Splits CSS files"], ans: 1, exp: "Tree shaking strips unreferenced function exports from compiled production bundles." },
  { q: "What is the difference between Debouncing and Throttling for event handlers?", opts: ["They are identical", "Debouncing delays execution until a pause after the last event; Throttling enforces a maximum frequency of execution at regular intervals", "Throttling cancels all calls", "Debouncing runs on mouse move only"], ans: 1, exp: "Debounce waits for inactivity; Throttle limits execution rate to once every X milliseconds." },
  { q: "What does the 'SameSite=Strict' cookie attribute enforce?", opts: ["Cookie works on all websites", "Browser never sends the cookie in cross-site requests, providing robust protection against CSRF", "Cookie works over HTTP only", "Cookie cannot be deleted"], ans: 1, exp: "SameSite=Strict blocks cookies on cross-origin navigations and embedded requests." },
  { q: "How does React's Concurrent Mode and 'useTransition' hook optimize user input responsiveness?", opts: ["Runs React on 8 threads", "Marks state updates as non-urgent transitions that can be interrupted by urgent user inputs (typing, clicking)", "Disables re-rendering", "Compiles code to C"], ans: 1, exp: "useTransition keeps the main thread responsive to urgent interactions while computing heavy transitions." }
];

export const WEB_MCQS = createTopicQuestions('web-dev', 'Full Stack Web Development', webEasy, webMedium, webHard);

// 7. Cloud & DevOps (50 questions: 15 Easy, 25 Medium, 10 Hard)
const cloudEasy = [
  { q: "What is Cloud Computing?", opts: ["Storing files on USB", "On-demand availability of computing resources (servers, storage, databases) over the internet with pay-as-you-go pricing", "Writing code in HTML", "Using private local hard drives"], ans: 1, exp: "Cloud computing delivers elastic infrastructure over the internet." },
  { q: "Which of the following is a leading cloud provider?", opts: ["Amazon Web Services (AWS)", "Vim", "Sublime", "MySQL"], ans: 0, exp: "AWS, Google Cloud, and Microsoft Azure are major cloud hyperscalers." },
  { q: "What is a Virtual Machine (VM)?", opts: ["A video game console", "A software emulation of a physical computer running an OS and applications independently", "A USB drive", "A web browser"], ans: 1, exp: "VMs run guest operating systems isolated on hypervisors." },
  { q: "What does 'SaaS' stand for in cloud models?", opts: ["Server as a System", "Software as a Service", "Storage as a Solution", "Security as a System"], ans: 1, exp: "SaaS provides ready-to-use software applications over the internet (e.g. Gmail, Figma)." },
  { q: "What does 'IaaS' stand for in cloud models?", opts: ["Infrastructure as a Service", "Internet as a Server", "Identity as a Solution", "Instance as a Service"], ans: 0, exp: "IaaS provides fundamental compute, storage, and networking (e.g. AWS EC2)." },
  { q: "What does 'PaaS' stand for in cloud models?", opts: ["Platform as a Service", "Private as a System", "Process as a Solution", "Performance as a Server"], ans: 0, exp: "PaaS provides hardware and software tools for app deployment without OS management." },
  { q: "What is Docker primarily used for?", opts: ["Database backups", "Package applications and their dependencies into lightweight, portable containers", "Video editing", "Writing documentation"], ans: 1, exp: "Docker standardizes application packaging into isolated container images." },
  { q: "What is a Dockerfile?", opts: ["A container log", "A text script containing instructions to assemble a Docker container image", "A password file", "A Docker license"], ans: 1, exp: "A Dockerfile defines the sequential steps to build an image." },
  { q: "What is Git in software development?", opts: ["A cloud host", "A distributed version control system for tracking changes in source code", "A compiler", "A database engine"], ans: 1, exp: "Git manages version history and collaborative branching." },
  { q: "What does 'CI' stand for in CI/CD?", opts: ["Continuous Integration", "Cloud Infrastructure", "Code Inspection", "Central Intelligence"], ans: 0, exp: "Continuous Integration automates code building and automated testing." },
  { q: "What does 'CD' stand for in CI/CD?", opts: ["Compact Disk", "Continuous Delivery / Continuous Deployment", "Cloud Database", "Code Design"], ans: 1, exp: "Continuous Delivery/Deployment automates release and deployment pipelines." },
  { q: "What is the AWS service for scalable virtual cloud compute servers?", opts: ["AWS S3", "AWS EC2", "AWS Lambda", "AWS RDS"], ans: 1, exp: "Amazon Elastic Compute Cloud (EC2) provides resizable compute capacity." },
  { q: "What is Amazon S3 primarily used for?", opts: ["Running Python scripts", "Scalable object storage for files, images, backups, and static websites", "Relational SQL database", "Domain registration"], ans: 1, exp: "Simple Storage Service (S3) stores unstructured objects." },
  { q: "What is the purpose of a Load Balancer?", opts: ["Measures server weight", "Distributes incoming network traffic across multiple servers to prevent overload and ensure high availability", "Charges credit cards", "Compiles code"], ans: 1, exp: "Load balancers distribute requests evenly across healthy worker nodes." },
  { q: "What is a 'Rollback' in deployment?", opts: ["Moving a server physical rack", "Reverting a software deployment back to the previously stable working version upon detecting failure", "A backup command", "A git pull"], ans: 1, exp: "Rollback restores previous operational state when new releases fail." }
];

const cloudMedium = [
  { q: "What is the core difference between a Docker Container and a Virtual Machine?", opts: ["Containers have physical screens", "VMs run full guest OS on hypervisors; Containers share the host OS kernel and isolate user space, making them much lighter", "VMs cannot run Linux", "Containers are slower"], ans: 1, exp: "Containers share the host kernel, booting in milliseconds with negligible overhead." },
  { q: "What is Kubernetes (K8s)?", opts: ["A programming language", "An open-source container orchestration platform for automating deployment, scaling, and management of containerized apps", "A cloud server provider", "A Docker replacement"], ans: 1, exp: "Kubernetes manages clusters of containerized workloads at scale." },
  { q: "What is a Kubernetes 'Pod'?", opts: ["A physical server", "The smallest deployable computing unit in Kubernetes, wrapping one or more containers sharing storage and network", "A container image file", "A git branch"], ans: 1, exp: "Pods encapsulate one or more co-located containers in Kubernetes." },
  { q: "What is Infrastructure as Code (IaC)?", opts: ["Writing comments in code", "Managing and provisioning computing infrastructure through machine-readable definition files (e.g. Terraform) rather than manual GUI configuration", "A Python web framework", "Compiling hardware"], ans: 1, exp: "IaC automates consistent, version-controlled cloud environment provisioning." },
  { q: "Which tool is the industry standard for declarative, multi-cloud Infrastructure as Code?", opts: ["Postman", "Terraform", "Photoshop", "Notion"], ans: 1, exp: "HashiCorp Terraform provisions multi-cloud infrastructure via declarative HCL." },
  { q: "What is 'Serverless' computing (e.g. AWS Lambda)?", opts: ["Computers without CPUs", "Execution model where the cloud provider dynamically manages server allocation and provisions resources only when an event triggers execution", "Running apps offline", "Private hardware only"], ans: 1, exp: "Serverless abstracts server maintenance; billing occurs strictly per invocation." },
  { q: "What does 'High Availability' (HA) mean in cloud architecture?", opts: ["Server is located on high floors", "Designing systems to remain operational without interruption over long periods, often across multiple Availability Zones", "High network speeds only", "High monetary cost"], ans: 1, exp: "HA ensures systems withstand hardware faults through redundant failovers." },
  { q: "What is an AWS 'Availability Zone' (AZ)?", opts: ["A continent", "One or more discrete data centers with redundant power, networking, and connectivity within an AWS Region", "A subnet group", "A user account"], ans: 1, exp: "AZs provide fault isolation within geographic AWS Regions." },
  { q: "What is a 'Reverse Proxy' (e.g. Nginx)?", opts: ["A proxy for users to browse hidden sites", "A server positioned in front of web servers that intercepts client requests, handles SSL termination, and routes traffic", "A database connector", "A Docker registry"], ans: 1, exp: "Reverse proxies provide security, caching, SSL termination, and routing for origin servers." },
  { q: "What is the purpose of Docker Compose?", opts: ["Drawing diagrams", "A tool for defining and running multi-container Docker applications using a single YAML configuration file", "Compiling C code", "A cloud monitor"], ans: 1, exp: "docker-compose.yml manages multi-container application stacks locally and in staging." },
  { q: "What is Prometheus used for in DevOps?", opts: ["Code editing", "Open-source systems monitoring and alerting toolkit collecting metric time-series data", "Database clustering", "Git hosting"], ans: 1, exp: "Prometheus scrapes and stores operational metric time-series." },
  { q: "What is Grafana commonly used for?", opts: ["Database indexing", "Data visualization and interactive dashboard creation for monitoring system metrics", "Running unit tests", "Hosting Docker images"], ans: 1, exp: "Grafana visualizes Prometheus, CloudWatch, and Elasticsearch metrics." },
  { q: "What does a 'Health Check' endpoint (e.g. /healthz) do in distributed systems?", opts: ["Scans for viruses", "Allows orchestrators and load balancers to poll service operational status and restart or remove unhealthy instances", "Logs user passwords", "Tests internet speed"], ans: 1, exp: "Health checks communicate liveness and readiness to orchestrators." },
  { q: "What is a Blue-Green Deployment strategy?", opts: ["Color coding branches", "Running two identical production environments (Blue and Green); switching router traffic from Blue to Green once verified to achieve zero downtime", "Deploying on weekends", "Testing only in staging"], ans: 1, exp: "Blue-Green minimizes downtime and offers instant rollback by swapping environment router pointers." },
  { q: "What is a Canary Deployment strategy?", opts: ["Deploying to yellow servers", "Gradually rolling out updates to a small subset of real users (e.g. 5%) before expanding to the entire fleet", "Deploying with birds", "A testing framework"], ans: 1, exp: "Canary releases validate new versions against production traffic with minimal blast radius." },
  { q: "What is the purpose of Secrets Management (e.g. HashiCorp Vault, AWS Secrets Manager)?", opts: ["Hiding source code", "Securely storing, rotating, and controlling access to sensitive API keys, database credentials, and tokens", "Encrypting PDF files", "Private Slack channels"], ans: 1, exp: "Secrets managers prevent hardcoded credentials in source repositories." },
  { q: "What is a Bastion Host (Jump Box)?", opts: ["A gaming server", "A secure, hardened server used to access and manage instances in a private subnet across the public internet", "A web proxy", "A database replica"], ans: 1, exp: "Bastion hosts act as single controlled gateway checkpoints into private VPC subnets." },
  { q: "What does an AWS VPC (Virtual Private Cloud) provide?", opts: ["A free website", "A logically isolated virtual network dedicated to your cloud resources with custom subnets, route tables, and gateways", "A shared hard drive", "An email server"], ans: 1, exp: "VPCs isolate networking topology and security boundaries in the cloud." },
  { q: "What is the difference between Public and Private Subnets in a VPC?", opts: ["Public subnets have internet gateway routing; Private subnets have no direct public internet route", "Public subnets are free; Private are paid", "Private subnets cannot run databases", "They are identical"], ans: 0, exp: "Public subnets assign public IPs with Internet Gateway routes; private subnets route internally." },
  { q: "What is a NAT Gateway used for in AWS?", opts: ["Routing user traffic to databases", "Enabling instances in a private subnet to connect out to the internet (e.g. for updates) while blocking incoming internet connections", "Encrypting files", "Speeding up CPU"], ans: 1, exp: "NAT Gateways allow outbound-only internet connectivity for private instances." },
  { q: "What does 'git rebase' do compared to 'git merge'?", opts: ["Deletes commits", "Reapplies commits on top of another base tip, creating a linear history without merge commit bubbles", "Clones a repository", "Uploads code to GitHub"], ans: 1, exp: "Rebase rewires branch history linearly by reapplying changes on top of the target branch." },
  { q: "What is a multi-stage Docker build used for?", opts: ["Running multiple containers", "Using multiple FROM instructions in a Dockerfile to separate build dependencies from the final minimal production runtime image", "Building on 2 computers", "Testing code"], ans: 1, exp: "Multi-stage builds prevent large build toolchains from bloating production images." },
  { q: "What is the role of an Ingress Controller in Kubernetes?", opts: ["Manages container logs", "Manages external HTTP/HTTPS access and routing into services within a cluster", "Deletes old pods", "Allocates CPU"], ans: 1, exp: "Ingress rules map external HTTP domains to internal cluster services." },
  { q: "What is Chaos Engineering (e.g. Chaos Monkey)?", opts: ["Writing messy code", "The discipline of intentionally injecting failures into production systems to build confidence in fault resilience", "Hacking other companies", "Deleting backups"], ans: 1, exp: "Chaos engineering tests system self-healing under simulated real-world failures." },
  { q: "What is GitOps (e.g. ArgoCD, Flux)?", opts: ["A git tutorial", "Operational framework where Git repositories serve as the single source of truth for declarative infrastructure and application deployments", "A GitHub feature", "A cloud server"], ans: 1, exp: "GitOps synchronizes live cluster state continuously with version-controlled Git manifests." }
];

const cloudHard = [
  { q: "What is the CAP Theorem in distributed data systems?", opts: ["Cost, Access, Performance trade-off", "A distributed system can guarantee at most two of: Consistency, Availability, and Partition Tolerance simultaneously", "Cloud Architecture Principle", "CPU, Array, Port law"], ans: 1, exp: "Under network partitions (P), a distributed system must choose between Consistency (C) or Availability (A)." },
  { q: "What is a Service Mesh (e.g. Istio, Linkerd)?", opts: ["A physical network cable", "A dedicated infrastructure layer using sidecar proxies to manage service-to-service communication, mTLS encryption, and observability", "A cloud hosting plan", "A Docker registry"], ans: 1, exp: "Service meshes inject sidecar proxies to govern security, tracing, and traffic routing transparently." },
  { q: "What is mutual TLS (mTLS) in microservice architectures?", opts: ["One-way server verification", "Cryptographic protocol where both client and server authenticate each other's certificates before establishing an encrypted channel", "A database cipher", "An HTTP header"], ans: 1, exp: "mTLS enforces zero-trust bidirectional identity verification across internal services." },
  { q: "How does the Raft Consensus Algorithm guarantee replicated state machine agreement?", opts: ["Random guessing", "Elects a single leader who manages replicated log entries across quorum majority of cluster nodes", "Uses blockchain proof-of-work", "Relies on a single master clock"], ans: 1, exp: "Raft decomposes consensus into leader election, log replication, and safety guarantees." },
  { q: "What is the 'Split-Brain' scenario in distributed clusters and how is it prevented?", opts: ["CPU overheating", "When network partitions cause two isolated sub-clusters to both claim leadership; prevented by requiring strict quorum majority (N/2 + 1)", "A corrupt hard drive", "Dual monitor bug"], ans: 1, exp: "Quorum voting prevents conflicting dual leaders during network splits." },
  { q: "What is a Circuit Breaker pattern in microservices (e.g. Resilience4j)?", opts: ["An electrical fuse", "Detects consecutive downstream service failures and trips open immediately returning fallbacks, preventing cascading systemic outages", "A firewall rule", "An auth token check"], ans: 1, exp: "Circuit breakers isolate downstream failures to avoid tying up thread pools and crashing callers." },
  { q: "What is Distributed Tracing (e.g. OpenTelemetry, Jaeger)?", opts: ["Tracing IP addresses", "Propagating unique trace and span IDs across microservice network calls to visualize end-to-end latency bottlenecks", "Tracking employees", "Logging git commits"], ans: 1, exp: "Distributed tracing tracks request lifecycles across polyglot microservice topologies." },
  { q: "What is the difference between Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA) in Kubernetes?", opts: ["HPA changes CPU frequency; VPA changes RAM", "HPA scales the number of replica Pods; VPA adjusts the CPU/memory resource allocations of existing Pods", "HPA is only for databases", "They are identical"], ans: 1, exp: "HPA scales pod replicas based on load; VPA adjusts individual pod resource requests/limits." },
  { q: "How does eBPF (Extended Berkeley Packet Filter) revolutionize Linux cloud observability and security?", opts: ["Compiles Python to assembly", "Allows running sandboxed bytecode programs inside the Linux kernel safely without changing kernel source or loading modules", "Replaces Docker", "Encrypts SSDs"], ans: 1, exp: "eBPF attaches non-intrusive high-performance observability and networking hooks inside kernel space." },
  { q: "What is Immutable Infrastructure in modern DevOps paradigms?", opts: ["Servers that can never be turned off", "Servers/containers are never modified or patched in-place; updates are deployed by replacing instances entirely with newly built images", "Read-only databases", "Physical on-premise servers"], ans: 1, exp: "Immutable infrastructure eliminates configuration drift by replacing rather than mutating live instances." }
];

export const CLOUD_MCQS = createTopicQuestions('cloud-devops', 'Cloud & DevOps Engineering', cloudEasy, cloudMedium, cloudHard);

export const ALL_MCQ_BANKS = {
  python: PYTHON_MCQS,
  'ui-ux': UIUX_MCQS,
  dsa: DSA_MCQS,
  sql: SQL_MCQS,
  ml: ML_MCQS,
  'web-dev': WEB_MCQS,
  'cloud-devops': CLOUD_MCQS
};

// Target Roles with required skills & mapped assessment topics
export const TARGET_ROLE_DEFINITIONS = [
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design & Product',
    description: 'User research, wireframing, high-fidelity interactive prototyping, design systems, and usability heuristics.',
    topics: ['ui-ux', 'web-dev'],
    requiredSkills: [
      { name: 'User Research', weight: 90, category: 'UI/UX', priority: 'Critical' },
      { name: 'Wireframing & Prototyping', weight: 92, category: 'UI/UX', priority: 'Critical' },
      { name: 'Figma & Design Systems', weight: 95, category: 'UI/UX', priority: 'Critical' },
      { name: 'Usability Testing & Heuristics', weight: 88, category: 'UI/UX', priority: 'High' },
      { name: 'Visual Design & Typography', weight: 85, category: 'UI/UX', priority: 'High' },
      { name: 'Information Architecture', weight: 80, category: 'UI/UX', priority: 'Medium' },
      { name: 'HTML & CSS Fundamentals', weight: 70, category: 'Web Development', priority: 'Medium' }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    description: 'Modern JavaScript/TypeScript, React/Next.js, responsive web layouts, accessibility, and state management.',
    topics: ['web-dev', 'ui-ux', 'dsa'],
    requiredSkills: [
      { name: 'JavaScript / TypeScript', weight: 95, category: 'Programming', priority: 'Critical' },
      { name: 'React & Component Architecture', weight: 92, category: 'Web Development', priority: 'Critical' },
      { name: 'HTML5 & Responsive CSS', weight: 90, category: 'Web Development', priority: 'Critical' },
      { name: 'State Management & Hooks', weight: 85, category: 'Web Development', priority: 'High' },
      { name: 'REST & API Integration', weight: 82, category: 'Web Development', priority: 'High' },
      { name: 'Web Performance & Accessibility', weight: 80, category: 'Web Development', priority: 'Medium' },
      { name: 'Git & Version Control', weight: 85, category: 'Tools', priority: 'High' }
    ]
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    description: 'Scalable microservices, REST/GraphQL APIs, relational & NoSQL datastores, distributed caching, and auth.',
    topics: ['sql', 'dsa', 'python', 'cloud-devops'],
    requiredSkills: [
      { name: 'Backend Programming (Node/Python)', weight: 92, category: 'Programming', priority: 'Critical' },
      { name: 'SQL & Database Architecture', weight: 90, category: 'Database', priority: 'Critical' },
      { name: 'REST API & Microservice Design', weight: 88, category: 'Web Development', priority: 'Critical' },
      { name: 'Data Structures & Algorithms', weight: 85, category: 'Programming', priority: 'High' },
      { name: 'Authentication & JWT Security', weight: 82, category: 'Tools', priority: 'High' },
      { name: 'Docker & Containerization', weight: 80, category: 'DevOps', priority: 'Medium' }
    ]
  },
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    description: 'End-to-end web engineering across client side, server architectures, databases, and continuous delivery.',
    topics: ['web-dev', 'sql', 'dsa', 'cloud-devops'],
    requiredSkills: [
      { name: 'React & Frontend Frameworks', weight: 90, category: 'Web Development', priority: 'Critical' },
      { name: 'Node.js / Express Backend', weight: 90, category: 'Web Development', priority: 'Critical' },
      { name: 'SQL & Database Design', weight: 85, category: 'Database', priority: 'High' },
      { name: 'Data Structures & Problem Solving', weight: 82, category: 'Programming', priority: 'High' },
      { name: 'API Design & Integration', weight: 88, category: 'Web Development', priority: 'Critical' },
      { name: 'Docker & Cloud Deployment', weight: 78, category: 'DevOps', priority: 'Medium' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data Science & AI',
    description: 'Statistical hypothesis modeling, machine learning pipelines, data wrangling, and predictive intelligence.',
    topics: ['python', 'ml', 'sql'],
    requiredSkills: [
      { name: 'Python for Data Science', weight: 92, category: 'Programming', priority: 'Critical' },
      { name: 'Machine Learning Pipelines', weight: 90, category: 'AI/ML', priority: 'Critical' },
      { name: 'SQL & Data Wrangling', weight: 85, category: 'Database', priority: 'High' },
      { name: 'Statistical Analysis & Math', weight: 88, category: 'Data Science', priority: 'Critical' },
      { name: 'Pandas & NumPy', weight: 90, category: 'Programming', priority: 'High' },
      { name: 'Data Visualization & Storytelling', weight: 80, category: 'Data Science', priority: 'Medium' }
    ]
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    category: 'Data Science & AI',
    description: 'Production model training, deep neural networks, low-latency inference serving, and MLOps automation.',
    topics: ['ml', 'python', 'dsa', 'cloud-devops'],
    requiredSkills: [
      { name: 'Deep Learning & PyTorch', weight: 92, category: 'AI/ML', priority: 'Critical' },
      { name: 'Machine Learning Algorithms', weight: 90, category: 'AI/ML', priority: 'Critical' },
      { name: 'Python Software Engineering', weight: 88, category: 'Programming', priority: 'High' },
      { name: 'Data Structures & Algorithms', weight: 82, category: 'Programming', priority: 'High' },
      { name: 'Model Deployment & Docker', weight: 85, category: 'DevOps', priority: 'High' },
      { name: 'MLOps & Experiment Tracking', weight: 80, category: 'DevOps', priority: 'Medium' }
    ]
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Data Science & AI',
    description: 'LLM fine-tuning, RAG pipelines, prompt engineering, agentic systems, vector databases, and multimodal inference.',
    topics: ['ml', 'python', 'dsa', 'web-dev'],
    requiredSkills: [
      { name: 'Generative AI & LLMs', weight: 95, category: 'AI/ML', priority: 'Critical' },
      { name: 'Vector DBs & Embeddings', weight: 90, category: 'Database', priority: 'Critical' },
      { name: 'Python for AI Systems', weight: 92, category: 'Programming', priority: 'Critical' },
      { name: 'RAG Architecture & Retrieval', weight: 88, category: 'AI/ML', priority: 'High' },
      { name: 'Prompt Engineering & Agents', weight: 85, category: 'AI/ML', priority: 'High' },
      { name: 'API Deployment & FastAPI', weight: 82, category: 'Web Development', priority: 'High' }
    ]
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Infrastructure',
    description: 'Cloud native architectures, IAM access, VPC networking, storage provisioning, and multi-region resilience.',
    topics: ['cloud-devops', 'web-dev', 'python'],
    requiredSkills: [
      { name: 'AWS Cloud Services', weight: 95, category: 'Cloud', priority: 'Critical' },
      { name: 'Cloud Security & IAM', weight: 90, category: 'Cloud', priority: 'Critical' },
      { name: 'Infrastructure as Code (Terraform)', weight: 88, category: 'DevOps', priority: 'High' },
      { name: 'VPC Networking & Routing', weight: 85, category: 'Cloud', priority: 'High' },
      { name: 'Docker & Microservices', weight: 85, category: 'DevOps', priority: 'High' }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Infrastructure',
    description: 'Continuous integration, continuous deployment, automated testing, observability, and container orchestration.',
    topics: ['cloud-devops', 'web-dev', 'python'],
    requiredSkills: [
      { name: 'CI/CD Automation Pipelines', weight: 95, category: 'DevOps', priority: 'Critical' },
      { name: 'Kubernetes Orchestration', weight: 92, category: 'DevOps', priority: 'Critical' },
      { name: 'Docker & Containerization', weight: 90, category: 'DevOps', priority: 'Critical' },
      { name: 'Prometheus & Grafana Monitoring', weight: 85, category: 'DevOps', priority: 'High' },
      { name: 'Linux & Shell Scripting', weight: 88, category: 'Tools', priority: 'High' }
    ]
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure',
    description: 'Infrastructure as code, CI/CD automation pipelines, container orchestration with Kubernetes, and monitoring.',
    topics: ['cloud-devops', 'web-dev', 'python'],
    requiredSkills: [
      { name: 'Docker & Containerization', weight: 95, category: 'DevOps', priority: 'Critical' },
      { name: 'Kubernetes Orchestration', weight: 90, category: 'DevOps', priority: 'Critical' },
      { name: 'CI/CD Automation Pipelines', weight: 92, category: 'DevOps', priority: 'Critical' },
      { name: 'AWS Cloud Services', weight: 88, category: 'Cloud', priority: 'High' },
      { name: 'Infrastructure as Code (Terraform)', weight: 85, category: 'DevOps', priority: 'High' },
      { name: 'Linux & Shell Scripting', weight: 85, category: 'Tools', priority: 'High' }
    ]
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    category: 'Software Engineering',
    description: 'Object-oriented programming, core algorithms, clean system design, databases, and problem solving.',
    topics: ['dsa', 'python', 'sql', 'web-dev'],
    requiredSkills: [
      { name: 'Data Structures & Algorithms', weight: 92, category: 'Programming', priority: 'Critical' },
      { name: 'Object-Oriented Design', weight: 88, category: 'Programming', priority: 'High' },
      { name: 'Database & SQL Fundamentals', weight: 82, category: 'Database', priority: 'High' },
      { name: 'Git & Clean Code Practices', weight: 85, category: 'Tools', priority: 'High' },
      { name: 'System Design Fundamentals', weight: 80, category: 'Architecture', priority: 'Medium' }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data Science & Analytics',
    description: 'Business intelligence, SQL querying, dashboards, Excel modeling, and statistical hypothesis testing.',
    topics: ['sql', 'python'],
    requiredSkills: [
      { name: 'Advanced SQL Querying', weight: 95, category: 'Database', priority: 'Critical' },
      { name: 'Python & Pandas Wrangling', weight: 85, category: 'Programming', priority: 'High' },
      { name: 'BI Tools (PowerBI / Tableau)', weight: 90, category: 'Data Science', priority: 'Critical' },
      { name: 'Statistical Testing', weight: 80, category: 'Data Science', priority: 'High' },
      { name: 'Data Visualization', weight: 88, category: 'Data Science', priority: 'High' }
    ]
  },
  {
    id: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    category: 'Security & Infrastructure',
    description: 'Network security, penetration testing, threat mitigation, IAM policies, and vulnerability management.',
    topics: ['cloud-devops', 'web-dev', 'python'],
    requiredSkills: [
      { name: 'Network Security & Firewalls', weight: 92, category: 'Security', priority: 'Critical' },
      { name: 'Web Application Security (OWASP)', weight: 90, category: 'Security', priority: 'Critical' },
      { name: 'Cryptography & Auth Protocols', weight: 88, category: 'Security', priority: 'High' },
      { name: 'Cloud Security & IAM', weight: 85, category: 'Cloud', priority: 'High' },
      { name: 'Python Scripting for Security', weight: 80, category: 'Programming', priority: 'Medium' }
    ]
  },
  {
    id: 'custom-role',
    title: 'Other / Custom Role',
    category: 'Custom Specialized',
    description: 'Customized target role tailored to student-specific interdisciplinary career aspirations.',
    topics: ['dsa', 'web-dev', 'python'],
    requiredSkills: [
      { name: 'Core Problem Solving', weight: 85, category: 'Programming', priority: 'High' },
      { name: 'Domain Technical Knowledge', weight: 85, category: 'Specialized', priority: 'Critical' },
      { name: 'Project Execution', weight: 85, category: 'Projects', priority: 'High' },
      { name: 'Professional Communication', weight: 80, category: 'Soft Skills', priority: 'High' }
    ]
  }
];
