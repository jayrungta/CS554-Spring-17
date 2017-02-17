"use strict";

var Recipe = React.createClass({
  displayName: "Recipe",

  getInitialState: function getInitialState() {
    return { showingDetails: false };
  },
  showMore: function showMore(e) {
    e.preventDefault();
    this.setState({ showingDetails: true });
  },
  showLess: function showLess(e) {
    e.preventDefault();
    this.setState({ showingDetails: false });
  },
  render: function render() {
    var bodyContent = undefined;
    var toggler = undefined;
    if (this.state.showingDetails) {
      var steps = this.props.steps.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      var ingredients = this.props.ingredients.map(function (step) {
        return React.createElement(
          "li",
          null,
          step
        );
      });

      bodyContent = React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          null,
          this.props.description
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-8" },
            React.createElement(
              "ol",
              null,
              steps
            )
          ),
          React.createElement(
            "div",
            { className: "col-sm-4" },
            React.createElement(
              "ul",
              null,
              ingredients
            )
          )
        )
      );
      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showLess, href: "" },
          "Show Less"
        )
      );
    } else {
      var words = this.props.description.split(' ');
      bodyContent = React.createElement(
        "p",
        null,
        words.slice(0, 35).join(" "),
        words.length > 35 ? '... ' : undefined,
        words.length > 35 ? React.createElement(
          "a",
          { onClick: this.showMore },
          "read on"
        ) : undefined
      );

      toggler = React.createElement(
        "p",
        { className: "text-center" },
        React.createElement(
          "a",
          { onClick: this.showMore, href: "" },
          "Show Details"
        )
      );
    }

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        this.props.title
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        bodyContent,
        toggler
      )
    );
  }
});
"use strict";

var RecipeForm = React.createClass({
    displayName: "RecipeForm",
    getInitialState: function getInitialState() {
        return { title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "", errMessage: "", flag: false };
    },
    changeTitle: function changeTitle(e) {
        this.setState({ title: e.target.value });
    },
    changeDescription: function changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient: function addIngredient(e) {
        this.setState({ errMessage: "" });
        if (this.state.newIngredient == "") {
            this.setState({ errMessage: "The recipe needs to have some ingredients!" });
            return;
        }
        var ingredients = this.state.ingredients.concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    changeNewIngredientText: function changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
    },
    addStep: function addStep(e) {
        this.setState({ errMessage: "" });
        if (this.state.newStep == "") {
            this.setState({ errMessage: "The recipe needs to have some steps!" });
            return;
        }
        var steps = this.state.steps.concat([this.state.newStep]);

        this.setState({ steps: steps, newStep: "" });
    },
    changeNewStepText: function changeNewStepText(e) {
        this.setState({ newStep: e.target.value });
    },
    addRecipe: function addRecipe(e) {
        var _this = this;

        this.setState({ errMessage: "", flag: false });

        try {
            if (this.state.title == "") {
                throw "The recipe needs to have a title!";
            } else if (this.state.description == "") {
                throw "The recipe needs to have a description!";
            } else if (this.state.ingredients.length == 0) {
                throw "The recipe needs to have some ingredients!";
            } else if (this.state.steps.length == 0) {
                throw "The recipe needs to have some steps!";
            } else {
                for (var i = 0; i < this.props.recipes.length; i++) {
                    if (this.props.recipes[i].title == this.state.title) {
                        throw "A similar recipe already exists!";
                    }
                }
            }
        } catch (error) {
            this.setState({ errMessage: error });
            return;
        }

        var newRecipe = { title: this.state.title, description: this.state.description, steps: this.state.steps, ingredients: this.state.ingredients };

        $.ajax({
            type: "POST",
            url: "/recipes",
            data: { recipe: newRecipe },
            success: function success(recipe) {
                _this.props.addNewRecipe(recipe);
                _this.setState({ title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "", errMessage: "", flag: true });
            },
            error: function error(xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },
    render: function render() {
        var newTitleText = "New Recipe: " + (this.state.title || '') + " (" + this.state.ingredients.length + " ingredients, " + this.state.steps.length + " steps)";

        return React.createElement(
            "div",
            { className: "recipe" },
            React.createElement(
                "div",
                { className: this.state.errMessage == '' ? 'hidden' : 'alert alert-danger show', role: "alert" },
                this.state.errMessage
            ),
            React.createElement(
                "div",
                { className: this.state.flag == false ? 'hidden' : 'alert alert-success show', role: "alert" },
                "New recipe added with no issues!"
            ),
            React.createElement(
                "h3",
                null,
                "Add a New Recipe"
            ),
            React.createElement(
                "div",
                { className: "form-horizontal" },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "newTitle", className: "col-sm-3 control-label" },
                        "Title"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-9" },
                        React.createElement("input", {
                            className: "form-control",
                            id: "newTitle",
                            placeholder: "New Recipe",
                            onChange: this.changeTitle,
                            value: this.state.title,
                            type: "text" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "newDescription", className: "col-sm-3 control-label" },
                        "Description"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-9" },
                        React.createElement("textarea", {
                            className: "form-control",
                            id: "newDescription",
                            placeholder: "Recipe description",
                            onChange: this.changeDescription,
                            value: this.state.description })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "newIngredientText", className: "col-sm-3 control-label" },
                        "New Ingredient"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-9" },
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            React.createElement("input", {
                                className: "form-control",
                                type: "text",
                                id: "newIngredientText",
                                placeholder: "New Ingredient",
                                value: this.state.newIngredient,
                                onChange: this.changeNewIngredientText }),
                            React.createElement(
                                "span",
                                { className: "input-group-btn" },
                                React.createElement(
                                    "button",
                                    { className: "btn btn-primary", type: "button", onClick: this.addIngredient },
                                    "Add Ingredient"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { htmlFor: "newStepText", className: "col-sm-3 control-label" },
                        "New Step"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-9" },
                        React.createElement("textarea", {
                            className: "form-control",
                            type: "text",
                            id: "newIngredientText",
                            placeholder: "New Step Instructions",
                            value: this.state.newStep,
                            onChange: this.changeNewStepText })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "div",
                        { className: "col-sm-offset-3 col-sm-9" },
                        React.createElement(
                            "button",
                            { className: "btn btn-primary", type: "button", onClick: this.addStep },
                            "Add Step"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "div",
                        { className: "col-sm-12" },
                        React.createElement(
                            "button",
                            { type: "submit", className: "btn btn-default", onClick: this.addRecipe },
                            "Add Recipe"
                        )
                    )
                )
            ),
            React.createElement(Recipe, {
                title: newTitleText,
                description: this.state.description,
                steps: this.state.steps,
                ingredients: this.state.ingredients })
        );
    }
});
"use strict";

var RecipeList = React.createClass({
    displayName: "RecipeList",

    getInitialState: function getInitialState() {
        return { recipes: [] };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function success(recipeList) {
                _this.setState({ recipes: recipeList });
            },
            error: function error(xhr, status, err) {
                console.error(_this.props.url, status, err.toString());
            }
        });
    },
    addNewRecipe: function addNewRecipe(recipe) {
        var recipes = this.state.recipes.concat(recipe);

        this.setState({ recipes: recipes });
    },
    render: function render() {
        var recipeList = this.state.recipes;
        var recipes = recipeList.map(function (recipe) {
            return React.createElement(Recipe, {
                key: recipe.id,
                title: recipe.title,
                description: recipe.description,
                id: recipe.id,
                steps: recipe.steps,
                ingredients: recipe.ingredients });
        });

        return React.createElement(
            "div",
            { className: "recipe" },
            recipes,
            React.createElement("hr", null),
            React.createElement(RecipeForm, { recipes: this.state.recipes, addNewRecipe: this.addNewRecipe })
        );
    }
});

ReactDOM.render(React.createElement(RecipeList, { url: "/recipes" }), document.getElementById('content'));