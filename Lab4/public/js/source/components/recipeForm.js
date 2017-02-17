const RecipeForm = React.createClass({
    getInitialState() {
        return { title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "", errMessage: "", flag: false };
    },
    changeTitle(e) {
        this.setState({ title: e.target.value });
    },
    changeDescription(e) {
        this.setState({ description: e.target.value });
    },
    addIngredient(e) {
        this.setState({ errMessage: "" });
        if (this.state.newIngredient == "") {
            this.setState({ errMessage: "The recipe needs to have some ingredients!" });
            return;
        }
        let ingredients = this
            .state
            .ingredients
            .concat([this.state.newIngredient]);

        this.setState({ ingredients: ingredients, newIngredient: "" });
    },
    changeNewIngredientText(e) {
        this.setState({ newIngredient: e.target.value });
    },
    addStep(e) {
        this.setState({ errMessage: "" });
        if (this.state.newStep == "") {
            this.setState({ errMessage: "The recipe needs to have some steps!" });
            return;
        }
        let steps = this
            .state
            .steps
            .concat([this.state.newStep]);

        this.setState({ steps: steps, newStep: "" });
    },
    changeNewStepText(e) {
        this.setState({ newStep: e.target.value });
    },
    addRecipe(e) {
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

        let newRecipe = { title: this.state.title, description: this.state.description, steps: this.state.steps, ingredients: this.state.ingredients };

        $.ajax({
            type: "POST",
            url: "/recipes",
            data: { recipe: newRecipe },
            success: (recipe) => {
                this.props.addNewRecipe(recipe);
                this.setState({ title: "", description: "", steps: [], ingredients: [], newIngredient: "", newStep: "", errMessage: "", flag: true });
            },
            error: (xhr, status, err) => {
                console.error(status, err.toString());
            }
        });
    },
    render() {
        let newTitleText = `New Recipe: ${this.state.title || ''} (${this.state.ingredients.length} ingredients, ${this.state.steps.length} steps)`;

        return (

            <div className="recipe">
                <div className={this.state.errMessage == '' ? 'hidden' : 'alert alert-danger show'} role="alert">
                    {this.state.errMessage}
                </div>
                <div className={this.state.flag == false ? 'hidden' : 'alert alert-success show'} role="alert">
                    New recipe added with no issues!
            </div>
                <h3>Add a New Recipe</h3>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="newTitle" className="col-sm-3 control-label">Title</label>
                        <div className="col-sm-9">
                            <input
                                className="form-control"
                                id="newTitle"
                                placeholder="New Recipe"
                                onChange={this.changeTitle}
                                value={this.state.title}
                                type="text" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDescription" className="col-sm-3 control-label">Description</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                id="newDescription"
                                placeholder="Recipe description"
                                onChange={this.changeDescription}
                                value={this.state.description}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newIngredientText" className="col-sm-3 control-label">New Ingredient</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="newIngredientText"
                                    placeholder="New Ingredient"
                                    value={this.state.newIngredient}
                                    onChange={this.changeNewIngredientText} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={this.addIngredient}>Add Ingredient</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newStepText" className="col-sm-3 control-label">New Step</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                type="text"
                                id="newIngredientText"
                                placeholder="New Step Instructions"
                                value={this.state.newStep}
                                onChange={this.changeNewStepText}></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-3 col-sm-9">
                            <button className="btn btn-primary" type="button" onClick={this.addStep}>Add Step</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <button type="submit" className="btn btn-default" onClick={this.addRecipe}>Add Recipe</button>
                        </div>
                    </div>
                </div>
                <Recipe
                    title={newTitleText}
                    description={this.state.description}
                    steps={this.state.steps}
                    ingredients={this.state.ingredients} />
            </div>
        );
    }
});