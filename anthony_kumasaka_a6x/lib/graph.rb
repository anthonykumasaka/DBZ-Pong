class Vertex
  attr_reader :out_edges, :in_edges
  def initialize(value)
    @value = value 
    @out_edges = []
    @in_edges = []
  end
end

class Edge
  attr_reader :from_vertex, :to_vertex, :cost 
  def initialize(from_vertex, to_vertex, cost = 1)
    @cost = cost 
    @from_vertex = from_vertex
    @to_vertex = to_vertex

    @from_vertex.out_edges << self
    @to_vertex.in_edges << self 
  end

  def destroy!
    
  end

  protected
  
end
