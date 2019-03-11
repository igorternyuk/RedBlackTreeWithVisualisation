class RBTree {
  constructor(comparator = (a, b) => {
    return a > b ? 1 : (a < b ? -1 : 0);
  }){
    this.root = null;
    this.comparator = comparator;
    this.height = 0;
    this.hightChanged = true;
  }

  find(data){
      let currNode = this.root;
      while(currNode){
          if(this.comparator(data, currNode.data) === 0){
              return currNode;
          } else {
              currNode = this.comparator(data, currNode.data) < 0
                        ? currNode.leftChild
                        : currNode.rightChild;
          }
      }
      return null;
  }

  remove(data){
      let nodeToRemove = this.find(data);
      if(!nodeToRemove){
          /*There is no element with such key in the tree*/
          return;
      }
      let child = null;
      if(nodeToRemove.leftChild && nodeToRemove.rightChild){
          /*The node to remove has two children*/
          let successor = nodeToRemove.rightChild;
          /*We find the left most element in the right sub-tree*/
          while(successor.leftChild){
              successor = successor.leftChild;
          }
          nodeToRemove.data = successor.data;
          nodeToRemove = successor;
      } else if(nodeToRemove.leftChild || nodeToRemove.rightChild){
          /*The node to remove has only one child*/
          child = nodeToRemove.leftChild
                  ? nodeToRemove.leftChild
                  : nodeToRemove.rightChild;
          child.parent = nodeToRemove.parent;
      }

      let parent = nodeToRemove.parent;
      if(parent){
          if(nodeToRemove === parent.leftChild){
              parent.leftChild = child;
          } else {
              parent.rightChild = child;
          }
      } else {
          this.root = child;
      }
      if(nodeToRemove.color === Color.BLACK){
          this.removeFixup(child);
      }
  }

  removeFixup(node){

  }


  insert(data){
    let currNode = this.root;
    let parent = null;
    while(currNode){
        //The element with such key already exists
        if(this.comparator(data, currNode.data) === 0){
            return currNode;
        }
        parent = currNode;
        currNode = (this.comparator(data, currNode.data) < 0)
                  ? currNode.leftChild
                  : currNode.rightChild;

    }
    let newNode = new Node(data);
    newNode.color = Color.RED;
    newNode.parent = parent;
    if(parent){
        if(this.comparator(newNode.data, parent.data) < 0){
          parent.leftChild = newNode;
        } else if(this.comparator(newNode.data, parent.data) > 0){
          parent.rightChild = newNode;
        }
    } else {
        newNode.color = Color.BLACK;
        this.root = newNode;
    }
    this.insertFixup(newNode);
    return newNode;
  }

  insertFixup(node){

  }


  inorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    this.inorderTraversal(node.leftChild, visitFunc);
    visitFunc(node);
    this.inorderTraversal(node.rightChild, visitFunc);
  }

  preorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    visitFunc(node);
    this.preorderTraversal(node.leftChild, visitFunc);
    this.preorderTraversal(node.rightChild, visitFunc);
  }

  postorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    this.postorderTraversal(node.leftChild, visitFunc);
    this.postorderTraversal(node.rightChild, visitFunc);
    visitFunc(node);
  }

  visualize(){
      //draw(this.root, canvasWidth / 2, nodeRadius, 0);
      this.render(this.root, canvasWidth / 2, nodeRadius, 0);
  }

  render(root, parentX, parentY, level){
    if(!root){
      return;
    }

    let maxHeight = this.getMaxHeight();
    //console.log("maxHeight = " + maxHeight);
    let offsetY = (canvasHeight - 2 * nodeRadius) / (maxHeight - 1);
    let offsetX = canvasWidth / (Math.pow(2, level) + 1) / 2;
    let currNodeX = parentX;
    let currNodeY = parentY;
    if(root.parent){
      //console.log("Applying offsets ...");
      //console.log("offsetY = " + offsetY);
      //console.log("offsetX = " + offsetX);
      if(root == root.parent.leftChild){
        currNodeX -= offsetX;
      } else {
        currNodeX += offsetX;
      }
      currNodeY += offsetY;
      //console.log("currNodeX = " + currNodeX);
      //console.log("currNodeY = " + currNodeY);
      let angle = Math.atan2(parentY - currNodeY, parentX - currNodeX);
      let dx = 0.5 * nodeRadius * Math.cos(angle);
      let dy = 0.5 * nodeRadius * Math.sin(angle);
      line(currNodeX, currNodeY, parentX - dx, parentY - dy);
    }
    //console.log("currNodeX = " + currNodeX);
    //console.log("currNodeY = " + currNodeY);
    this.render(root.leftChild, currNodeX, currNodeY, level + 1);

    if(root.highlighted){
      fill(255);
    } else {
      if(root.color == Color.RED){
          fill(255, 0, 0);
      } else {
          fill(0);
      }
    }

    ellipse(currNodeX, currNodeY, nodeRadius, nodeRadius);
    textAlign(CENTER);
    if(root.highlighted){
        fill(0);
    } else {
        fill(255, 255, 0);
    }

    text(root.data, currNodeX, currNodeY + nodeRadius / 8);
    //console.log("root.data = " + root.data + " level = " + level);

    this.render(root.rightChild, currNodeX, currNodeY, level + 1);
  }

  walk(startNode, walkFunc, level){
    if(!startNode){
      return;
    }
    this.walk(startNode.leftChild, walkFunc, level + 1);
    walkFunc(startNode, level);
    this.walk(startNode.rightChild, walkFunc, level + 1);
  }

  getMaxHeight(){
    if(!this.hightChanged){
      return this.height;
    } else {
      this.hightChanged = false;
      this.height = this.getHeight(this.root);
      return this.height;
    }
  }

  getHeight(node){
    if(!node){
      return 0;
    }
    return Math.max(this.getHeight(node.leftChild), this.getHeight(node.rightChild)) + 1;
  }

  size(){
    return this.countNodes(this.root);
  }

  countNodes(node){
    if(!node){
      return 0;
    }
    return this.countNodes(node.leftChild) + this.countNodes(node.rightChild) + 1;
  }

  getMax(){
    if(this.root){
      let currNode = this.root;
      while(currNode.rightChild){
        currNode = currNode.rightChild;
      }
      return currNode.data;
    } else {
      return null;
    }
  }

  getMin(){
    if(this.root){
      let currNode = this.root;
      while(currNode.leftChild){
        currNode = currNode.leftChild;
      }
      return currNode.data;
    } else {
      return null;
    }
  }


}
