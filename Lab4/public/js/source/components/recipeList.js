
const RecipeList = React.createClass({
    getInitialState: function () {
        return { recipes: [] };
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (recipeList) => {
                this.setState({ recipes: recipeList });
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    addNewRecipe: function (recipe) {
        let recipes = this
            .state
            .recipes
            .concat(recipe);

        this.setState({ recipes: recipes });
    },
    render: function () {
        let recipeList = this.state.recipes;
        let recipes = recipeList.map((recipe) => {
            return (
                <Recipe
                    key={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    id={recipe.id}
                    steps={recipe.steps}
                    ingredients={recipe.ingredients} />
            );
        });

        return (
            <div className="recipe">
                {recipes}
                <hr />
                <RecipeForm recipes={this.state.recipes} addNewRecipe={this.addNewRecipe} />
            </div>
        );
    }
});

ReactDOM.render(
    <RecipeList url="/recipes" />, document.getElementById('content'));