# Graphs and Topological Sort

---
Hopefully the outline for the Vertex and Edge classes was straightforward.
Can anyone think of a way to model a graph that only uses a Vertex class?
How about only a Graph class?

---

```ruby
class Vertex
  attr_reader :value, :in_edges, :out_edges

  def initialize(value)
    @value = value
    @in_edges = []
    @out_edges = []
  end
end

class Edge
  attr_reader :to_vertex, :from_vertex, :cost

  def initialize(from_vertex, to_vertex, cost = 1)
    @from_vertex = from_vertex
    @to_vertex = to_vertex
    @cost = cost

    to_vertex.in_edges << self
    from_vertex.out_edges << self
  end

  def destroy!
    @to_vertex.in_edges.delete(self)
    @to_vertex = nil
    @from_vertex.out_edges.delete(self)
    @from_vertex = nil
  end

  protected
  attr_writer :from_vertex, :to_vertex, :cost
end
```
---
## TopologicalSort

---
### Kahn's Algorithm

* Make a queue to hold vertices with zero in_edges, populate it by iterating through the input to find 'starting' vertices
* Make a result object to hold the order in which vertices are processed
* Until the queue is empty, remove a vertex from the graph:
  * Shift a vertex off of the queue and store it in the result
  * Iterate through its out_edges, reducing the number of in_edges for each destination vertex by the edge weight
  * If the destination vertex now has zero in_edges, it gets put onto the queue
* If the result is not of the same length as the input, we have a cycle or an incomplete list of the graph.

---
* If you iterate over the out_edges directly, removing the edge (via `#destroy!`) messes up the loop because that method removes it from the array you are iterating over, so you might have had to `#dup` the out_edges first.
* If we use a hash to keep track of the in-degree of the vertices, we can avoid issues relating to destroying edges.
* The time complexity is `O(V + E)`; every vertex is processed eventually as we loop through the queue, and within each loop we look at every edge associated with that vertex.

---
```ruby
# Kahn's
# O(|V| + |E|).
def topological_sort(vertices)
  queue = []
  in_edges = {}
  order = []

  vertices.each do |vert|
    in_edge_count = vert.in_edges.reduce(0){ |accum, edge| accum += edge.cost }
    in_edges[vert] = in_edge_count
    queue << vert if in_edge_count == 0
  end

  until queue.empty?
    vertex = queue.shift

    vertex.out_edges.each do |edge|
      new_vertex = edge.to_vertex
      in_edges[new_vertex] -= edge.cost
      queue << new_vertex if in_edges[new_vertex] == 0
    end

    order << vertex
  end
  
  vertices.length == order.length ? order : []
end
```

---
### Alternate
```ruby
def topological_sort(vertices)
  sorted = []
  q = []
  
  vertices.each do |vertex|
    q.push(vertex) if vertex.in_edges.empty?
  end
  
  until q.empty?
    curr = q.shift
    sorted << curr
    edges = curr.out_edges.dup
    edges.each do |edge|
      if edge.to_vertex.in_edges.count <= 1
        q.push(edge.to_vertex)
      end
      edge.destroy!
    end
  end
  
  vertices.length == sorted.length ? sorted : []
end
```

---
### Tarjan's Algorithm

Tarjan's Algorithm uses DFS to explore nodes until they have no children or no unvisited children.

Once a node's connections have been exhausted it is unshifted onto the result. Nodes that have 'later' dependencies will be processed before those that have 'earlier' ones. Each node and edge is visited once so time complexity is linear.

Cycle catching is a little tricky.

---
### Without cycle catching
```ruby
def topological_sort(vertices)
  ordering = []
  explored = Set.new
  
  vertices.each do |vertex| # O(|v|)
    dfs!(vertex, explored, ordering) unless explored.include?(vertex)
  end
  
  ordering
end

def dfs!(vertex, explored, ordering)
  explored.add(vertex)
  
  vertex.out_edges.each do |edge| # O(|e|)
    new_vertex = edge.to_vertex
    dfs!(new_vertex, explored, ordering) unless explored.include?(new_vertex)
  end
  
  ordering.unshift(vertex)
end
```

---
### Tarjan's with cycle catching
* We create a record of temporarily visited nodes so we know when we have encountered a loop within the context of a recursive stack
* In this implementation, we only record a node as visited when its connections have been exhausted; we also remove it from the temporary record at this point.
* We also pass around a `cycle` variable to enable the proof of our loop to bubble up and trigger early returns

---
```ruby
def topological_sort(vertices)
  order = []
  explored = Set.new
  temp = Set.new
  cycle = false

  vertices.each do |vertex|
    cycle = dfs!(vertex, explored, temp, order, cycle)  unless explored.include?(vertex)
    return [] if cycle
  end

  order
end


def dfs!(vertex, explored, temp, order, cycle)
  return true if temp.include?(vertex)
  temp.add(vertex)

  vertex.out_edges.each do |edge|
    next_vertex = edge.to_vertex
    cycle = dfs!(next_vertex, explored, temp, order, cycle) unless explored.include?(next_vertex)
    return true if cycle
  end

  explored.add(vertex)
  temp.delete(vertex)
  order.unshift(vertex)
  false
end
```

---

## Install Order

* Since dependencies are involved, we can use a graph
* By creating the graph and doing a topological sort on it, we will get the install order of the packages
* Since we have packages from `1..max_id`, but not all are listed, we have to find the `max_id` first; this could be a dependent or a dependency.


---
```ruby
def install_order(arr)
  max = 0
  vertices = {}
  arr.each do |tuple|
    # create the graph
    vertices[tuple[0]] = Vertex.new(tuple[0]) unless vertices[tuple[0]]
    vertices[tuple[1]] = Vertex.new(tuple[1]) unless vertices[tuple[1]]
    Edge.new(vertices[tuple[1]], vertices[tuple[0]])

    #reset max if needed
    max = tuple.max if tuple.max > max
  end


  # find the missing packages
  independent = []
  (1..max).each do |i|
    independent << i unless vertices[i]
  end

  # sort the vertices of the graph and add the missing packages
  independent + topological_sort(vertices.values).map { |v| v.value } 
end
```

---
## Practical Problems

### Install Order 2

In this version of the problem, all packages will be listed, (independent packages have nil value or no entry for their dependencies), but the package ids are not numbers. Do not use your notes.

```ruby
arr = [[3, 1], [2, 1], [6, 5],
       [3, 6], [3, 2], [4, 3],
       [9, 1], [1, nil], [5, nil]]

install_order2(arr) #=> [1, 5, 2, 9, 6, 3, 4]
```
---

Bonus: Allow for independent packages that are dependencies not to be listed seperately in the input array.
```ruby
arr = [[3, 1], [2, 1], [6, 5],
       [3, 6], [3, 2], [4, 3],
       [9, 1]]
install_order2(arr) #=> [1, 5, 2, 9, 6, 3, 4]
```

---
```ruby
def install_order2(arr)
  max = 0
  vertices = {}
  arr.each do |tuple|
    dependent = tuple[0]
    dependency = tuple[1]


    vertices[dependent] = Vertex.new(dependent) unless vertices[dependent]
    vertices[dependency] = Vertex.new(dependency) if dependency && !vertices[dependency]
    Edge.new(vertices[dependency], vertices[dependent]) if dependency
  end



  topological_sort(vertices.values).map { |v| v.value }
end
```
---