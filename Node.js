const Color = Object.freeze({RED: 0, BLACK: 1});

class Node{
  constructor(data, color = Color.RED){
      this.leftChild = null;
      this.rightChild = null;
      this.parent = null;
      this.color = color;
      this.data = data;
      this.highlighted = false;
  }

  getSibling(){
    if(!this.parent){
      return null;
    }
    return this === this.parent.leftChild
           ? this.parent.rightChild
           : this.parent.leftChild;
  }

  getGrandparent(){
    return this.parent ? this.parent.parent : null;
  }

  getUncle(){
    let grandparent = this.getGrandparent();
    if(!grandparent){
        return null;
    }
    return this.parent === grandparent.leftChild
           ? grandparent.rightChild
           : grandparent.leftChild;
  }
}

const NILL = new Node(0, Color.BLACK);
NILL.leftChild = NILL;
NILL.rightChild = NILL;
