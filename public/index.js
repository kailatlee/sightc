$(document).ready(function() {
  console.log('javascript in the browser yay');
  getAllPosts();

  function getAllPosts() {
    // Retrieve the posts
    $.get('/posts/', function(postsArray) {
      console.log(postsArray);

      var htmlString = "";
      for (var i=0; i < postsArray.length; i++){
        var currentPost = postsArray[i];

        console.log(currentPost);
        // Extract data
        var currentTitle = currentPost.doc.title;
        var currentContent = currentPost.doc.post;
        var currentId = currentPost.id;
        // Create html string for this post
        var postHtml = "<div class='card' id=''" + currentId + ">" +
          "<h3>" + currentTitle + "</h3>" +
          "<p>" + currentContent + "</p>" +
        "</div>";

        // Append to string we're building
        htmlString = htmlString + postHtml;
      }
        console.log(htmlString);

        // Change the page
        $("#postsWrapper").html(htmlString);
    });
  }

 // Handle form submission
  $("#post-submit").click(function(e) {
    // Prevent form refresh
    e.preventDefault();

    var titleText = $("#title").val();
    var postText = $("#post").val();

    $.post('/posts/', {
      title: titleText,
      post: postText,
    }, function() {
      getAllPosts();
    });
  });

  $(".delete-post").click(function() {
    var id = $(".delete-post"),parent().attri('id');
    console(id);
  });
});
