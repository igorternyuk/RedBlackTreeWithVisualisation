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

  rotateLeft(){

  }

  rotateRight(){

  }
}

const NILL = new Node(0, Color.BLACK);
