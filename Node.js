const Color = Object.freeze({RED: 0, BLACK: 1});

class Node{
  constructor(data, color = Color.RED){
      this.leftChild = null;
      this.rightChild = null;
      this.parent = null;
      this.color = Math.random(1) < 0.5 ? Color.BLACK : Color.RED;
      this.data = data;
      this.highlighted = false;
  }

  sibling(){
    if(!this.parent){
      return null;
    }
    return this === this.parent.leftChild
           ? this.parent.leftChild
           : this.parent.rightChild;
  }

  grandparent(){
    return this.parent ? this.parent.parent : null;
  }

  uncle(){
    let grandparent = this.grandparent();
    if(!grandparent){
        return null;
    }
    return this.parent === grandparent.leftChild
           ? grandparent.rightChild
           : grandparent.leftChild;
  }

  rotateLeft(){

  }

  rotateRight(){

  }
}
