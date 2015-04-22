/** @jsx React.DOM */

var React = require('react');
//var Tweet = require('./Tweet.react.js');

module.exports = Map = React.createClass({

  // Render our tweets
  render: function(){

    // Build list items of single tweet components using map
    // var content = this.props.tweets.map(function(tweet){
    //   return (
    //     <Tweet key={tweet._id} tweet={tweet} />
    //   )
    // });

    return (
      <div class="container">
        <div id="map_canvas"></div>
      </div>
    )

  }

}); 


