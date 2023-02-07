# Graphs/Topological Sort

You will have 60 minutes to complete this assessment. Please rename the folder to yourfirstname_yourlastname before you zip it up and submit it on Progress Tracker.

### Vertex and Edge

Start off by writing the Vertex and Edge Classes. The Vertex Class should take in an value and store in_edges and out_edges. The Edge Class should take in a from_vertex, a to_vertex, and a cost if it is weighted. It should add itself to the from_vertex and to_vertex's in and out edges respectively (accessor methods!). Its destroy method should remove it from the in and out edges and sets its from and to vertices to nil. Once you have the specs passing, move on to topological sort.

What you've created is an Adjacency List representation of a Graph.

### Kahn's Algorithm

Let's first write topological sort using Kahn's Algorithm.

The idea of Kahn’s algorithm is to repeatedly remove nodes that have zero in-degree. The steps are as follows:

* Determine the in-degree of each node.
* Collect nodes with zero in-degree in a queue.
* While the queue is not empty:
  - Pop node `u` from queue,
  - remove `u` from the graph (depending on your implementation, this may or may not involve the `destroy!` method; what are the complications to destroying as we loop? What is another way we can track the number of `in_edges`?),
  - check if there is a new node with in-degree zero (among the neighbors of `u`)
  - If yes, put that node into the queue.
  - We maintain a list that records in which order the nodes are removed.
* If the queue is empty:
  - if we removed all nodes from the graph, return the list
  - else we return an empty list that indicates that an order is not possible due to a cycle

What is the time complexity of this algorithm? Make sure to analyze time complexity based on the set of vertices and edges.

### Tarjan's Algorithm

Next, implement topological sort using Tarjan's Algorithm.

An alternative algorithm for topological sorting is based on depth-first search. The algorithm loops through each node of the graph, in an arbitrary order, initiating a depth-first search that terminates when it hits any node that has already been visited since the beginning of the topological sort or the node has no outgoing edges (i.e. a leaf node):

Each node n gets prepended to the output list L only after considering all other nodes which depend on n (all descendants of n in the graph). Specifically, when the algorithm adds node n, we are guaranteed that all nodes which depend on n are already in the output list L: they were added to L either by the recursive call to visit() which ended before the call to visit n, or by a call to visit() which started even before the call to visit n.

Cycle catching can be tricky, try without it first maybe.
What is the time complexity?