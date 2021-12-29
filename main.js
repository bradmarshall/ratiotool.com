
document.addEventListener("DOMContentLoaded", function() {
  new calculator();

  // Side menu.
  var sideMenu = document.querySelector("aside.side-menu");
  var launcher = document.querySelector(".menu-launcher");

  launcher.addEventListener("click", function() {
    sideMenu.classList.add("active");
    document.body.classList.add("menu-open");
  });

  menuCloseButton = document.querySelector("aside.side-menu .close-button");
  menuCloseButton.addEventListener("click", function() {
    sideMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});

function calculator() {
  this.leftNumerator = null;
  this.leftDenominator = null;
  this.rightNumerator = null;
  this.rightDenominator = null;

  this.calculateButton = null;

  this.results = null;

  this.init();
}

calculator.prototype.init = function() {
  var self = this;

  document.addEventListener("keydown", function(e) {
    if(e.keyCode == 13) {
      self.calculate();

      self.calculateButton.classList.add("active");
      setTimeout(function() {
        self.calculateButton.classList.remove("active");
      }, 80);
    }
  });

  this.leftNumerator    = document.querySelector("div.left input.numerator");
  this.leftDenominator  = document.querySelector("div.left input.denominator");
  this.rightNumerator   = document.querySelector("div.right input.numerator");
  this.rightDenominator = document.querySelector("div.right input.denominator");

  this.calculateButton   = document.querySelector("input#calculate");
  this.clearButton       = document.querySelector("div.clear-button");

  this.results = document.querySelector("div.results");

  // Toggle clear button state.
  this.clearButtonListener = function() {
    self.clearForm();
  };

  var numericInputs = document.querySelectorAll('div.controls input[type="number"]');

  for(i = 0; i < numericInputs.length; i++) {
    numericInputs[i].addEventListener("keyup", function(e) {
      if(self.leftNumerator.value.length ||
         self.leftDenominator.value.length ||
         self.rightNumerator.value.length ||
         self.rightDenominator.value.length) {
        
        self.clearButton.classList.remove("disabled");
        self.clearButton.addEventListener("click", self.clearButtonListener);
      } else {
        self.clearButton.classList.add("disabled");
        self.clearButton.removeEventListener("click", self.clearButtonListener);
      }
    });
  }

  // Perform calculation.
  this.calculateButton.addEventListener("click", function() {
    self.calculate();
  });
};

calculator.prototype.calculate = function() {
  this.results.innerHTML = "";

  // console.log("leftNumerator: "+this.leftNumerator.value);
  // console.log("leftDenominator: "+this.leftDenominator.value);
  // console.log("rightNumerator: "+this.rightNumerator.value);
  // console.log("rightDenominator: "+this.rightDenominator.value);

  if(this.leftNumerator.value.length && this.leftDenominator.value.length) {
    // Find right DENOMINATOR.
    if(this.rightNumerator.value.length && !this.rightDenominator.value.length) {
      this.rightDenominator.value = this.rightNumerator.value * (this.leftDenominator.value / this.leftNumerator.value);
      console.log(this.rightDenominator.value)
    }

    // Find right NUMERATOR.
    if(!this.rightNumerator.value.length && this.rightDenominator.value.length) {
      this.rightNumerator.value = this.rightDenominator.value * (this.leftNumerator.value / this.leftDenominator.value);
    }

    // Reduce ratio to it's lowest terms.
    var min = Math.min(this.leftNumerator.value, this.leftDenominator.value);

    var r1 = this.leftNumerator.value / min,
        r2 = this.leftDenominator.value / min;

    // populate right fraction with lowest terms if it's empty.
    if(!this.rightNumerator.value.length && !this.rightDenominator.value.length) {
      this.rightNumerator.value = r1;
      this.rightDenominator.value = r2;
    }

    // Check equivalency.
    if(this.leftNumerator.value.length &&
       this.leftDenominator.value.length &&
       this.rightNumerator.value.length &&
       this.rightDenominator.value.length) {

      var equivalencyResult = "<span>Left and right fractions are ";
      if((this.leftNumerator.value / this.leftDenominator.value) == (this.rightNumerator.value / this.rightDenominator.value)) {
        equivalencyResult += '<strong style="color: #90d255;">Equivalent</strong>';
      } else {
        equivalencyResult += '<strong style="color: #FF6868;">Not equivalent</strong>';
      }
      equivalencyResult += "</span>";
    }

    var lowestTermsResult = "<span><strong>"+this.leftNumerator.value+"</strong> : <strong>"+this.leftDenominator.value+"</strong> in lowest terms is <strong>"+r1+"</strong> : <strong>"+r2+"</strong></span>";

    this.results.innerHTML  = "<p>" + lowestTermsResult + "<br>" + equivalencyResult + "</p>";
  } else {
    this.results.innerHTML = '<p><span style="color: #FF6868;">Must enter enter both left values</span></p>';
  }
};

calculator.prototype.clearForm = function() {
  this.leftNumerator.value = "";
  this.leftDenominator.value = "";
  this.rightNumerator.value = "";
  this.rightDenominator.value = "";

  this.results.innerHTML = "";

  this.clearButton.classList.add("disabled");
  this.clearButton.removeEventListener("click", this.clearButtonListener);
};