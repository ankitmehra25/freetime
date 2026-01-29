1. Time complexity

What is the time complexity of binary search on a sorted array of size N?

A. O(1)
B. O(log N)
C. O(N\*M)
D. O(N)

Answer: B

2. OOPs

A `Square` class inherits from a `Rectangle` class. When a client sets the width of the `Square`, its height automatically updates, breaking assumptions made by code that uses the `Rectangle` base class (e.g., area calculation). Which SOLID principle is primarily violated?

A. Open/Closed Principle
B. Dependency Inversion Principle
C. Interface Segregation Principle
D. Liskov Substitution Principle

Answer: D

3. Stack memory allocation

Which of the following is true about Stack memory allocation?

A. It is slower than Heap allocation
B. It is automatically managed by the CPU
C. It requires manual deallocation
D. It is used for large global objects

Answer: B

4. Heap vs Stack

Which issue is not caused by excessive stack usage?

A. Stack overflow
B. Limited recursion depth
C. Thread stack exhaustion
D. Memory leaks

Answer: D

5. Databases – Normalization

Which normal form primarily eliminates transitive dependencies?

A. 1NF
B. 2NF
C. 3NF
D. BCNF

Answer: C

6. Arrays vs Linked List

Which statement correctly compares the performance of Arrays and Singly Linked Lists?

A. Arrays allow O(1) random access by index, while Linked Lists require O(N) traversal
B. Arrays allow O(1) insertion at the beginning, whereas Linked Lists require O(N)
C. Linked Lists allow O(1) random access by index, while Arrays require O(N) traversal
D. Both Arrays and Linked Lists have O(1) insertion at the end, regardless of capacity

Answer: A

7. SQL vs NoSQL

What is a primary difference between a typical SQL database and a NoSQL database?

A. NoSQL databases typically offer more flexible or schema-less data models
B. SQL databases do not support transactions
C. SQL databases cannot scale horizontally
D. NoSQL databases always guarantee ACID properties

Answer: A

8. Partitioning vs Sharding

What is the primary architectural difference between Database Partitioning and Sharding?

A. Partitioning splits a table within a single database instance, while Sharding distributes data across multiple independent database servers
B. Partitioning improves read performance, while Sharding only improves write performance
C. Sharding is supported by all SQL databases natively, while Partitioning is not
D. Partitioning requires a load balancer, while Sharding does not

Answer: A

9. Process vs Thread

What is the fundamental difference between a process and a thread in terms of resource isolation?

A. Processes share memory space, threads have separate memory
B. Threads share the process's address space, processes have isolated memory
C. Processes are lighter weight than threads
D. Threads cannot communicate with each other

Answer: B

10. TCP/IP Protocol

Which mechanism does TCP use to establish a reliable connection before data transfer begins?

A. A single ACK signal
B. UDP heartbeats
C. DNS lookup
D. Three-way handshake (SYN, SYN-ACK, ACK)

Answer: D

11. Throughput

What is the primary reason batching requests can increase throughput but worsen latency for individual requests?

A. Individual requests must wait for a batch to fill before processing begins
B. Batching causes thread starvation
C. CPU cache misses increase proportionally with batch size
D. Network bandwidth decreases with larger payloads

Answer: A

12. Latency vs Throughput

If you increase the number of concurrent worker threads in a CPU-bound application beyond the number of available cores, what is the most likely impact on Latency and Throughput?

A. Throughput increases significantly, Latency decreases
B. Latency stays the same, Throughput doubles
C. Both Latency and Throughput improve linearly
D. Throughput degrades due to context switching, Latency increases

Answer: D

13. Event-Driven Architecture

Why is debugging distributed event-driven systems often more complex than monolithic systems?

A. Decentralized, asynchronous flow makes tracing a request through the system difficult without distributed tracing
B. Event consumers usually process messages faster than producers create them
C. Message brokers like Kafka or RabbitMQ consume too much memory
D. Logging is impossible in event-driven architectures

Answer: A

14. Trees (Data Structures)

Which of the following properties is true for every node in a valid Binary Search Tree (BST)?

A. All nodes must have exactly two children
B. The root node must always contain the median value of all elements
C. The tree must always be perfectly balanced (same height for all leaves)
D. All nodes in the left subtree have values less than the node's value, and all nodes in the right subtree have values greater than it

Answer: D

15. Error Handling - NullPointerException

A service receives a JSON request and maps it into a `Profile` object. If the `address` field is missing from the JSON, the `profile.getAddress()` method returns `null`. Which of the following code snippets will throw a `NullPointerException`?

A. `System.out.println(profile.getAddress());`
B. `if (profile.getAddress() != null) { ... }`
C. `String city = profile.getAddress().getCity();`
D. `String addrString = String.valueOf(profile.getAddress());`

Answer: C

16. Compiler Design

Which stage of a compiler is responsible for breaking the source code into a sequence of 'tokens'?

A. Lexical Analysis
B. Syntax Analysis
C. Code Generation
D. Semantic Analysis

Answer: A

17. State Machines

What is a fundamental characteristic of a Finite State Machine (FSM)?

A. It can be in multiple states at the same time
B. It can only be in one state at any given point in time
C. It must have an infinite number of possible states
D. It does not require any input to transition between states

Answer: B

18. Graphs

Which graph concept best models deadlocks?

A. Directed acyclic graph
B. Spanning tree
C. Cycle detection in directed graph
D. Bipartite graph

Answer: C

19. Encryption vs Hashing

What is the fundamental difference between Encryption and Hashing?

A. Encryption is faster to compute than Hashing
B. Encryption is for data integrity, Hashing is for confidentiality
C. Hashing always produces a longer output than Encryption
D. Encryption is reversible, whereas Hashing is irreversible

Answer: D

20. Arrays - number of dimensions

What is generally true about the maximum number of dimensions supported by arrays in most programming languages?

A. Arrays are limited to 1 dimension
B. Arrays are limited to 2 dimensions
C. Arrays are limited to exactly 10 dimensions
D. There is no fixed limit; arrays can have any number of dimensions (language/memory dependent)

Answer: D

21. AI

What is the primary reason neural networks tend to overfit and generalize poorly when trained on small datasets?

A. The model has too many parameters relative to the amount of training data
B. Activation functions always saturate with limited data
C. Gradients always vanish with small batch sizes
D. Small datasets cause loss functions to become non-convex

Answer: A

22. Problem Framing

You’re asked to “optimize performance” of a slow service. What should be your first step to systematically identify the bottleneck?

A. Add caching to the most accessed endpoints
B. Increase CPU/memory resources immediately
C. Measure and profile the system to determine exactly where time is being spent
D. Rewrite critical code paths in a faster language

Answer: C

23. GENAI

What is the primary difference between Few-Shot prompting and Chain of Thought (CoT) prompting?

A. Few-shot provides examples of input-output pairs, while CoT includes intermediate reasoning steps to guide the model to the final answer.
B. Few-shot requires fine-tuning the model, while CoT only requires a specific prompt structure.
C. CoT is used for image generation, whereas Few-shot is only for text tasks.
D. Few-shot always results in higher accuracy than CoT for complex mathematical problems.

Answer: A

24. Design Patterns

Which design pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate?

A. Factory Method
B. Observer
C. Strategy
D. Singleton

Answer: A

25. Systems Reasoning

A distributed service that coordinates with a shared database becomes slower as more instances are added. What is the most plausible explanation?

A. Garbage collection pauses on individual instances
B. CPU cache misses on each server
C. Increased network communication overhead and coordination contention
D. Disk fragmentation on the application servers

Answer: C

26. Debugging Mindset

A system occasionally returns wrong results but logs show no errors. What is the most effective first step to systematically diagnose the root cause?

A. Add retries to mask the failures
B. Increase logging verbosity across all components
C. Reproduce the issue with controlled, minimal inputs to isolate the cause
D. Restart all services to clear any corrupted state

Answer: C

27. Leaky Abstractions

What is meant by the term "Leaky Abstraction"?

A. When code is duplicated across multiple abstraction layers
B. When implementation details bubble up and force the consumer to be aware of the underlying complexity
C. When an abstract class causes a memory leak
D. When an interface has too many methods to be useful

Answer: B

28. Failure Mode Thinking

Why do distributed systems favor idempotent operations?

A. Easier testing
B. Faster execution
C. Safe retries under failure
D. Reduced memory usage

Answer: C

29. CAP Theorem

You are deploying a global service that does profile updates. You choose a multi-region database. During a network partition, you notice that some users see old data while others see new data. According to the CAP theorem, which analytical decision was made?

A. AP (Availability and Partition Tolerance) was prioritized
B. CP (Consistency and Partition Tolerance) was prioritized
C. CA (Consistency and Availability) was prioritized
D. The CAP theorem does not apply to multi-region deployments

Answer: A

30. Forward vs Reverse Proxy

What is the primary difference between a Forward Proxy and a Reverse Proxy?

A. A Forward Proxy protects the server, while a Reverse Proxy protects the client.
B. A Forward Proxy is used by clients to access the external internet, while a Reverse Proxy sits in front of web servers to manage and load balance incoming requests.
C. A Forward Proxy handles database requests, while a Reverse Proxy handles file storage.
D. Forward proxies are only used for encryption, while reverse proxies are only used for compression.

Answer: B
