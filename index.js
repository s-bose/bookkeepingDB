var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shila31aug',
    database: 'BooksDB',
});

connection.connect(function (err) {
    if (err) {
        console.log(err.code);
        console.log(err.fatal);

    }
});



//main jquery.ready
$(document).ready(function () {


    //setting up the category list in the new book entry modal
    $categoryQuery = "SELECT * FROM `Category`";
    connection.query($categoryQuery, function (err, rows, fields) {
        if (err) {
            //handle error
            return;
        }
        var html = '';
        rows.forEach(function (row) {
            html += '<option value=\"' + row.CategoryID + '\">'
            html += row.CategoryName;
            html += '</option>';
        })
        $('#select-category').html(html);
    })


    //search query
    let TableUpdate = function () {
        var text = document.getElementById('searchInput').value;
        $query = "SELECT * FROM Books WHERE `BookName` LIKE \"" + text + "%\"";
        connection.query($query, function (err, rows, fields) {
            if (err) {
                console.log('an error has occured:');
                console.log(err);
                return;
            }

            //row entries for the book list
            var html = '';
            html += "<tr><th>ID</th><th>name</th><th>author</th><th>Category ID</th></tr>"
            rows.forEach(function (row) {
                html += '<tr class="clickable-row" data-toggle="modal" data-target="#BookInfoModal">';
                html += '<td>';
                html += row.BookID;
                html += '</td>';
                html += '<td>';
                html += row.BookName;
                html += '</td>';
                html += '<td>';
                html += row.AuthorName;
                html += '</td>';
                html += '<td>';
                html += row.CategoryID;
                html += '</td>';
                html += '</tr>';
            });
            document.querySelector('#table-info > tbody').innerHTML = html;

            $('.clickable-row').on('click', function () {
                var rowEntries = [];
                var rowInfo = $(this).html().split("</td>");
                for (let i = 0; i < rowInfo.length - 1; i++) {
                    rowEntries.push(rowInfo[i].slice(4));
                }
                //console.log(rowEntries);
                $('.media h5').html(rowEntries[1]);     //BookName
                $('#author > a').html(rowEntries[2]);   //AuthorName
                $('#bid > span').html(rowEntries[0]);   //BookID
                var catID = rowEntries[3];              //CategoryID
                
                //getting the category name for the given catID
                var catQuery = "SELECT CategoryName from Category WHERE CategoryID = \"" + catID + "\"";
                connection.query(catQuery, function (err, rows, fields) {
                    var str = rows[0].CategoryName;
                    //console.log(str);
                    $('#category > a').html(str);
                })
                $('#EditButton').on('click', function () {
                    $('#BookInfoModal').modal('hide');

                    //book entry form autofill
                    $('#book-name').val(rowEntries[1]);
                    $('#author-name').val(rowEntries[2]);
                    $('#select-category').val(rowEntries[3]);

                    BookEntryUpdate($(this));

                })
                $('#DeleteButton').on('click', function () {
                    $('#BookInfoModal').modal('hide');
                })

                $('#DeleteConfirmBtn').click(function () {

                    var deleteQuery = "DELETE FROM `Books` WHERE `BookID` = \"" + rowEntries[0] + "\"";
                    //console.log(deleteQuery);
                    connection.query(deleteQuery, function (response) {
                        //console.log(response);
                        if (response == null) {
                            $('#OnDeleteModal').modal('hide');
                            TableUpdate();
                        } else {
                            alert("Error deleting");
                        }
                    })
                })
            })

        })

    }
    //var searchButton = document.getElementById('Search');
    //searchButton.addEventListener("click", update);

    //on search input, call TableUpdate() to refresh table contents
    document.getElementById('searchInput').addEventListener("keyup", TableUpdate);

    //new book entry submit callback

    var BookEntryUpdate = function (obj) {
        
        var newBookQuery;
        if (obj.is('#EditButton')) {
            console.log("called by edit button");
            $('#book-entry-form').submit(function (event) {
                //event.preventDefault();
                var formInfo = $(this).serializeArray();
                newBookQuery = 'UPDATE `Books` SET `BookName` = \"' + formInfo[0].value + "\", `AuthorName` = \"" + formInfo[1].value + "\", CategoryID = \"" + formInfo[2].value + '\"';
                //console.log(newBookQuery);
                // connection.query(newBookQuery, function (response) {
                //     console.log(response);
                // })
                console.log(newBookQuery);
            })
        }
        else if (obj.is('#newEntryButton')) {
            console.log("called by new entry button");
            $('#book-entry-form').submit(function(e) {
                e.preventDefault();
                var formInfo = $(this).serializeArray();
                var newBookQuery = 'INSERT INTO Books (BookName, AuthorName, CategoryID) VALUES(\"' + formInfo[0].value + "\", \"" + formInfo[1].value + "\", \"" + formInfo[2].value + '\")';
                console.log(newBookQuery);
                connection.query(newBookQuery, function (response) {
                    console.log(response);    
                    $('#book-entry-form').trigger('reset');
                    $('#message').removeClass('hide').addClass('alert alert-success alert-dismissable').slideDown().show();
                    $('#message-content').html('<p>Success!</p>')
                    window.setTimeout(function() {
                        $(".alert").fadeTo(500, 0).slideUp(500, function(){
                            $(this).remove(); 
                        });
                    }, 1000);
                })
                return false;
            })
        }
        else {
            console.error("BookEntry called from unknown source");
        }
        
    }

    //calling BookEntryUpdate from NewEntryButton
    $('#newEntryButton').on('click', function() {
        $('#book-entry-form').trigger("reset");
        BookEntryUpdate($(this));
    })

})
