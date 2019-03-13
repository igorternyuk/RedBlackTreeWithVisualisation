var canvasWidth = 800;
var canvasHeight = 600;
var nodeRadius = 32;
var tree;
var initTime = 0;
var animation = [];
var highlightedIndex = -1;
var animationTimer = 0;
var animationActive = false;
var keyHandlers = {};

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(10);
    tree = new RBTree();
    for(let i = 1; i <= 40; ++i){
        tree.insert(floor(Math.random() * 799 + 100));
    }

    createKeyHandlers();
    console.log("keyHandlers = " + keyHandlers);
    console.log("tree.getMaxHeight() = " +  tree.getMaxHeight());
    console.log("tree.getMax() = " +  tree.getMax());
    console.log("tree.getMin() = " +  tree.getMin());
    console.log("tree.size() = " +  tree.size());
}

//main loop
function draw() {
  var frameTime = (millis() - initTime) / 1000;
  animationTimer += frameTime;
  //console.log("frameTime = " + frameTime);
  updateAnimation(frameTime);
  background(200);
  drawTreeInfo();
  tree.visualize();
  initTime = millis();
}

function createKeyHandlers(){
  keyHandlers['1'] = () => {
    console.log("Preorder");
    animation = [];
    tree.preorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };

  keyHandlers['2'] = function() {
    console.log("Inorder");
    animation = [];
    tree.inorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };

  keyHandlers['3'] = function() {
    console.log("Postorder");
    animation = [];
    tree.postorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };

  keyHandlers['A'] = function() {
    console.log("Left rotation");
    tree.rotateLeft(tree.root);
  };

  keyHandlers['D'] = function() {
    console.log("Right rotation");
    tree.rotateRight(tree.root);
  };
}

function drawTreeInfo(){
    textAlign(CENTER);
    fill(0,0,255);
    let treeInfo = "Node count = " + tree.size() + " MaxHeight = "
     + tree.getMaxHeight() + " MaxWidth = " + tree.getMaxWidth()
     + " MaxVal = " + tree.getMax() + " MinVal = " + tree.getMin();
    text(treeInfo, canvasWidth / 2, nodeRadius / 2);
    //drawPreorder();
    //drawInorder();
    //drawPostorder();
}

function drawPreorder(){
    let preorder = [];
    let preorderStr = "Preorder: ";
    tree.preorderTraversal(tree.root, (node) => {
      preorder.push(node);
    });
    //console.log(inorder);
    for(let i = 0; i < preorder.length; ++i){
        preorderStr += preorder[i].data;
        if(i != preorder.length - 1){
            preorderStr += " => ";
        }
    }
    text(preorderStr, 0, 3 * nodeRadius / 2);
}
function drawInorder(){
    let inorder = [];
    let inorderStr = "Inorder: ";
    tree.inorderTraversal(tree.root, (node) => {
      inorder.push(node);
    });
    for(let i = 0; i < inorder.length; ++i){
        inorderStr += inorder[i].data;
        if(i != inorder.length - 1){
            inorderStr += " => ";
        }
    }
    text(inorderStr, 0, 5 * nodeRadius / 2);
}
function drawPostorder(){
    let postorder = [];
    let postorderStr = "Postorder: ";
    tree.postorderTraversal(tree.root, (node) => {
      postorder.push(node);
    });
    for(let i = 0; i < postorder.length; ++i){
        postorderStr += postorder[i].data;
        if(i != postorder.length - 1){
            postorderStr += " => ";
        }
    }
    text(postorderStr, 0, 7 * nodeRadius / 2);
}

function updateAnimation(frameTime){
  if(animationTimer >= 1){
    animationTimer = 0;
    if(animationActive){
      if(highlightedIndex >= animation.length - 1){
        animation = [];
        highlightedIndex = -1;
        tree.inorderTraversal(tree.root, (node) => {
          node.highlighted = false;
        });
        animationActive = false;
      } else {
        if(highlightedIndex >= 0){
            animation[highlightedIndex].highlighted = false;
        }
        ++highlightedIndex;
        animation[highlightedIndex].highlighted = true;
      }
    }
  }
}

function keyReleased(){
  if(typeof keyHandlers[key] !== undefined){
    console.log("Handler was found");
    keyHandlers[key]();
  } else {
    console.log("Handler not found");
  }
}

function test(){
    for(let i = 1; i <= 200; ++i){
        console.log("***INSERTED => " + i);
        tree.insert(i);
    }
    for(let i = 1; i <= 200; ++i){
        let h1 = tree.size();
        tree.remove(i);
        console.log("***REMOVED => " + i);
        let h2 = tree.size();
        if(h1 - h2 > 1){
            console.log("BUG!!! => deltaSize =" + (h1 - h2));
        } else {
            console.log("GOOD!!! => deltaSize =" + (h1 - h2));
        }
    }
}
