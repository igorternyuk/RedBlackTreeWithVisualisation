var canvasWidth = 800;
var canvasHeight = 600;
var nodeRadius = 64;
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
    tree.insert(10);
    tree.insert(6);
    tree.insert(13);
    tree.insert(17);
    tree.insert(11);
    tree.insert(8);
    tree.insert(2);
    tree.insert(1);
    tree.insert(5);
    tree.insert(7);
    tree.insert(9);

    tree.walk(tree.root, (node, level) => {
      console.log("node.data = " + node.data + " level = " + level);
    }, 0);

    createKeyHandlers();
    console.log("keyHandlers = " + keyHandlers);
    console.log("tree.getMaxHeight() = " +  tree.getMaxHeight());
    console.log("tree.getMax() = " +  tree.getMax());
    console.log("tree.getMin() = " +  tree.getMin());
    console.log("tree.size() = " +  tree.size());
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
}

//main loop
function draw() {
  var frameTime = (millis() - initTime) / 1000;
  animationTimer += frameTime;
  //console.log("frameTime = " + frameTime);
  updateAnimation(frameTime);
	background(200);
  tree.visualize();
  initTime = millis();
}

function updateAnimation(frameTime){
  if(animationTimer >= 1){
    console.log("Animation timer event ...");
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
        console.log("highlightedIndex = " + highlightedIndex);
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
