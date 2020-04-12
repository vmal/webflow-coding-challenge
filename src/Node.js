/**
 * This is a Node Class for constructing a graph while exploring the urls
 */
class Node {
  constructor(url){
    this.url = url;
    this.children = [];
  }
}

export default Node;
