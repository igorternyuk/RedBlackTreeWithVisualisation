class RBTree {
  constructor(comparator = (a, b) => {
    return a > b ? 1 : (a < b ? -1 : 0);
  }){
    this.root = NILL;
    this.comparator = comparator;
    this.height = 0;
    this.hightChanged = true;
  }

  insert(data){
    this.hightChanged = true;
    let currNode = this.root;
    let parent = null;
    while(currNode && currNode !== NILL){
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
    newNode.leftChild = NILL;
    newNode.rightChild = NILL;

    if(parent){
        if(this.comparator(newNode.data, parent.data) < 0){
          parent.leftChild = newNode;
        } else {
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
      /*While we have not reached the root node
       and the red-red parent-child relationship exists we continue the loop*/
      while(node != this.root && node.parent.color === Color.RED){
          let uncle = node.getUncle();
          if(uncle && uncle.color === Color.RED){
              //Uncle is RED
              node.parent.color = Color.BLACK;
              uncle.color = Color.BLACK;
              let grandparent = node.getGrandparent();
              grandparent.color = Color.RED;
              node = grandparent;
          } else {
              //Uncle is BLACK
              let grandparent = node.getGrandparent();
              if(grandparent.leftChild === node.parent
                   && node === node.parent.rightChild) {
                  this.rotateLeft(node.parent);
                  node = node.leftChild;
              } else if(grandparent.rightChild === node.parent
                        && node === node.parent.leftChild) {
                  this.rotateRight(node.parent);
                  node = node.rightChild;
              }
              grandparent.color = Color.RED;
              node.parent.color = Color.BLACK;
              if(node === node.parent.leftChild
                   && node.parent === grandparent.leftChild){
                  this.rotateRight(grandparent);
              } else {
                  this.rotateLeft(grandparent);
              }
          }
      }
      this.root.color = Color.BLACK;
  }

  find(data){
      let currNode = this.root;
      while(currNode && currNode !== NILL){
          if(this.comparator(data, currNode.data) === 0){
              return currNode;
          } else {
              currNode = this.comparator(data, currNode.data) < 0
                        ? currNode.leftChild
                        : currNode.rightChild;
          }
      }
      return currNode;
  }

  remove(data){
      this.hightChanged = true;
      let nodeToRemove = this.find(data);
      if(!nodeToRemove || nodeToRemove === NILL){
          /*There is no element with such key in the tree*/
          return;
      }
      let child = null;
      if(nodeToRemove.leftChild !== NILL && nodeToRemove.rightChild !== NILL){
          /*The node to remove has two children*/
          console.log("Node to remove has two children");
          let successor = nodeToRemove.rightChild;
          /*We find the left most element in the right sub-tree*/
          while(successor.leftChild !== NILL){
              successor = successor.leftChild;
          }
          console.log("successor was found");
          nodeToRemove.data = successor.data;
          nodeToRemove = successor;
      }

      child = nodeToRemove.leftChild !== NILL
              ? nodeToRemove.leftChild
              : nodeToRemove.rightChild;
      let parent = nodeToRemove.parent;
      child.parent = nodeToRemove.parent;

      if(parent){
          if(nodeToRemove === parent.leftChild){
              parent.leftChild = child;
              console.log("parent.leftChild = child;");
          } else {
              parent.rightChild = child;
              console.log("parent.rightChild = child;");
          }
          console.log("Node was removed from chain");
          child.parent = parent;
          console.log("child.parent.data = " + child.parent.data);
      } else {
          this.root = child;
          console.log("New root");
      }

      if(nodeToRemove.color === Color.BLACK){
          if(child.color === Color.RED){
              child.color = Color.BLACK;
          } else {
              this.removeFixup(child);
          }
      }
  }

  removeFixup(node){
      console.log("RemoveFixup was called");
      if(node === null){
          console.log("Node is null");
      }
      while(node !== this.root && node.color === Color.BLACK){
          let sibling = node.getSibling();
          console.log("nodeData = " + node.data);
          console.log("sibling data = " + sibling.data);
          console.log("node.parent.data = " + node.parent.data);
          console.log("Remove fixup loop");
          if(sibling.color === Color.RED){
              console.log("Case 2 -> Sibling color is RED");
              sibling.color = Color.BLACK;
              node.parent.color = Color.RED;
              if(node === node.parent.leftChild){
                 this.rotateLeft(node.parent);
                  console.log("RotateLeft");
              } else {
                  this.rotateRight(node.parent);
                  console.log("RotateRight");
              }
              sibling = node.getSibling();
          }

          if(sibling.leftChild.color === Color.BLACK
              && sibling.rightChild.color === Color.BLACK){
                  console.log("Case 2-3");
                  console.log("Recoloring sibling to RED");
             /*if(parent.color === Color.BLACK){
                 //Parent is BLACK
                 console.log("Case 3 -> All nodes are BLACK");
                 sibling.color = Color.RED;
                 node = node.parent;
             } else {
                 //Parent is RED
                 console.log("Case 4 -> Sibling and its children are BLACK but the parent is RED");
                 sibling.color = Color.RED;
                 node.parent.color = Color.BLACK;
             }*/
             sibling.color = Color.RED;
             //node.parent.color = Color.BLACK;
             node = node.parent;
         } else {
             console.log("Black sibling");
             console.log("Before Case 5");
             if(node === node.parent.leftChild
                /*&& sibling.leftChild.color === Color.RED*/
                && sibling.rightChild.color === Color.BLACK){
                 sibling.color = Color.RED;
                 sibling.leftChild.color = Color.BLACK;
                 this.rotateRight(sibling);
                 console.log("N is left child of its parent and right child of sibling is red");
                 console.log("rotateRight");
             } else if(node === node.parent.rightChild
                       && sibling.leftChild.color === Color.BLACK
                   /*&& sibling.rightChild.color === Color.RED*/){
                 sibling.color = Color.RED;
                 sibling.rightChild.color = Color.BLACK;
                 this.rotateLeft(sibling);
                 console.log("N is right child of its parent and left child of sibling is red");
                 console.log("rotateLeft");
             }
             sibling = node.getSibling();
             console.log("After Case 5");
             console.log("Before case 6");
             //Delete case 6
             sibling.color = node.parent.color;
             console.log("Sibling.data = " + sibling.data);
             console.log("Setting sibling color to = " + node.parent.color);
             node.parent.color = Color.BLACK;
             console.log("node.parent = " + node.parent.data);
             console.log("Setting parent color to black");
             if(node === node.parent.leftChild){
                 console.log("node === node.parent.leftChild");
                 sibling.rightChild.color = Color.BLACK;
                 console.log("sibling.rightChild.data = " + sibling.rightChild.data);
                 console.log("Setting sibling color to black");
                 this.rotateLeft(node.parent);
                 console.log("this.rotateLeft(node.parent);");
             } else {
                 console.log("node === node.parent.rightChild");
                 sibling.leftChild.color = Color.BLACK;
                 this.rotateRight(node.parent);
                 console.log("sibling.leftChild.data = " + sibling.leftChild.data);
                 console.log("Setting sibling color to black");
                 console.log("this.rotateRight(node.parent);");
             }
             console.log("After Case 6");
             break;
             //node = this.root;
         }
      }
      node.color = Color.BLACK;
  }

  inorderTraversal(node, visitFunc){
    if(!node || node === NILL){
      return;
    }
    this.inorderTraversal(node.leftChild, visitFunc);
    visitFunc(node);
    this.inorderTraversal(node.rightChild, visitFunc);
  }

  preorderTraversal(node, visitFunc){
    if(!node || node === NILL){
      return;
    }
    visitFunc(node);
    this.preorderTraversal(node.leftChild, visitFunc);
    this.preorderTraversal(node.rightChild, visitFunc);
  }

  postorderTraversal(node, visitFunc){
    if(!node || node === NILL){
      return;
    }
    this.postorderTraversal(node.leftChild, visitFunc);
    this.postorderTraversal(node.rightChild, visitFunc);
    visitFunc(node);
  }

  rotateLeft(node){
     if(!node || node === NILL){
         return;
     }
     let pivot = node.rightChild;

     if(pivot){
        pivot.parent = node.parent;
     }
     if(node.parent){
         if(node === node.parent.leftChild){
             node.parent.leftChild = pivot;
         } else {
             node.parent.rightChild = pivot;
         }
     } else {
         this.root = pivot;
     }

     if(pivot){
         node.rightChild = pivot.leftChild;
         if(pivot.leftChild){
             pivot.leftChild.parent = node;
         }
         node.parent = pivot;
         pivot.leftChild = node;
     }
     this.hightChanged = true;
  }

  rotateRight(node){
      if(!node || node === NILL){
          return;
      }
      let pivot = node.leftChild;

      if(pivot){
         pivot.parent = node.parent;
      }
      if(node.parent){
          if(node === node.parent.leftChild){
              node.parent.leftChild = pivot;
          } else {
              node.parent.rightChild = pivot;
          }
      } else {
          this.root = pivot;
      }

      if(pivot){
          node.leftChild = pivot.rightChild;
          if(pivot.rightChild){
              pivot.rightChild.parent = node;
          }
          node.parent = pivot;
          pivot.rightChild = node;
      }
      this.hightChanged = true;
  }

  visualize(){
      //draw(this.root, canvasWidth / 2, nodeRadius, 0);
      this.render(this.root, canvasWidth / 2, nodeRadius, 0);
  }

  render(root, parentX, parentY, level){
    if(!root || root === NILL){
      return;
    }

    let maxHeight = this.getMaxHeight();
    let offsetY = (canvasHeight - 2 * nodeRadius) / (maxHeight - 1);
    let offsetX = canvasWidth / (Math.pow(2, level)) / 2;
    let currNodeX = parentX;
    let currNodeY = parentY;
    if(root.parent){
      if(root === root.parent.leftChild){
        currNodeX -= offsetX;
      } else {
        currNodeX += offsetX;
      }
      currNodeY += offsetY;
      let angle = Math.atan2(parentY - currNodeY, parentX - currNodeX);
      let dx = 0.5 * nodeRadius * Math.cos(angle);
      let dy = 0.5 * nodeRadius * Math.sin(angle);
      line(currNodeX, currNodeY, parentX - dx, parentY - dy);
    }
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
    this.render(root.rightChild, currNodeX, currNodeY, level + 1);
  }

  walk(rootNode, walkFunc, level){
    if(!rootNode || rootNode === NILL){
      return;
    }
    this.walk(rootNode.leftChild, walkFunc, level + 1);
    walkFunc(rootNode, level);
    this.walk(rootNode.rightChild, walkFunc, level + 1);
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
    if(node === NILL){
      return 0;
    }
    return Math.max(this.getHeight(node.leftChild), this.getHeight(node.rightChild)) + 1;
  }

  isEmpty(){
      return this.size() === 0;
  }

  getMaxWidth() {
        if(this.isEmpty()){
            return 0;
        }
        let height = this.getMaxHeight();
        let maxWidth = 0;
        for (let level = 0; level <= height; level++) {
            let currentWidth = this.getWidth(this.root, level);
            if(currentWidth > maxWidth){
                maxWidth = currentWidth;
            }
        }
        return maxWidth;
    }

    getWidth(root, level){
        if(root == NILL){
            return 0;
        }
        if(level == 1){
            return 1;
        } else if(level > 1){
            return this.getWidth(root.leftChild, level - 1)
                    + this.getWidth(root.rightChild, level - 1);
        } else {
            return 0;
        }
    }

  size(){
    return this.countNodes(this.root);
  }

  countNodes(node){
    if(node === NILL){
      return 0;
    }
    return this.countNodes(node.leftChild) + this.countNodes(node.rightChild) + 1;
  }

  getMax(){
    if(this.root){
      let currNode = this.root;
      while(currNode.rightChild !== NILL){
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
      while(currNode.leftChild !== NILL){
        currNode = currNode.leftChild;
      }
      return currNode.data;
    } else {
      return null;
    }
  }
}
