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
        html += '<option></option>';
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
        $query = "SELECT * FROM Books WHERE `BookName` LIKE \"%" + text + "%\" or `AuthorName` LIKE \"%" + text + "%\"";
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
                $('.media h5').html(rowEntries[1]); //BookName
                $('#author > a').html(rowEntries[2]); //AuthorName
                $('#bid > span').html(rowEntries[0]); //BookID
                var catID = rowEntries[3]; //CategoryID

                //getting the category name for the given catID
                var catQuery = "SELECT CategoryName from Category WHERE CategoryID = \"" + catID + "\"";
                connection.query(catQuery, function (err, rows, fields) {
                    var str = rows[0].CategoryName;
                    //console.log(str);
                    $('#category > a').html(str);
                })



                $('#EditButton').off('click').on('click', function () {
                    $('#BookInfoModal').modal('hide');

                    //book entry form autofill 
                    $('#book-id').attr('type', 'text');
                    $('#book-id').val(rowEntries[0]);
                    $('#book-name').val(rowEntries[1]);
                    $('#author-name').val(rowEntries[2]);
                    $('#select-category').val(rowEntries[3]);
                    BookEntryUpdate($(this));
                });




                //delete button function

                $('#DeleteButton').off('click').on('click', function () {
                    $('#BookInfoModal').modal('hide');
                })

                $('#DeleteConfirmBtn').off('click').on('click', function () {

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



                // borrow button function
                $('#BorrowButton').off('click').on('click', function () {
                    $('#borrow-form').trigger('reset');
                    $('#BookInfoModal').modal('hide');
                    $('#book-id-borrow').val(rowEntries[0]);
                })

                $('#borrow-form').off('submit').on('submit', function (e) {
                    e.preventDefault();
                    var book_id = $('#book-id-borrow').val();
                    var student_id = $('#student-id').val();

                    var borrowinsertion = "insert into `StudentBooks`(StudentID, BookID, IssueDate, ActionType) values (\"" + student_id + "\", \"" + book_id + "\", SYSDATE(), \"Issued\")";
                    console.log(borrowinsertion);

                    //if there's odd no of BookID entry that means everyone who once borrowed returned
                    //it its even then someone hasnt returned
                    $query = "select count(*) count from `StudentBooks` where `BookID` = \"" + book_id + "\"";
                    connection.query($query, function (err, rows, fields) {
                        console.log(rows[0].count);
                        retCount = rows[0].count;
                        if (retCount % 2 != 0) {
                            alert("Book is not returned yet. Cannot issue.");
                            $('#BorrowModal').modal('hide');
                        } else {
                            connection.query(borrowinsertion, function (resonse) {
                                $('#BorrowModal').modal('hide');
                                $('#success-popup').modal('show');
                            })
                        }
                    })
                })
            })



        })

    }


    //on search input, call TableUpdate() to refresh table contents
    document.getElementById('searchInput').addEventListener("keyup", TableUpdate);

    //new book entry submit callback

    var BookEntryUpdate = function (obj) {

        if (obj.is('#EditButton')) {
            console.log("called by edit button");
            $('#book-entry-form').off('submit').on('submit', function (event) {
                event.preventDefault();
                var formInfo = $(this).serializeArray();
                console.log(formInfo);
                BookUpdateQuery = 'UPDATE `Books` SET `BookName` = \"' + formInfo[1].value + "\", `AuthorName` = \"" + formInfo[2].value + "\", CategoryID = \"" + formInfo[3].value + '\" WHERE `BookID` = \"' + formInfo[0].value + '\"';
                console.log(BookUpdateQuery);
                connection.query(BookUpdateQuery, function (response) {
                    console.log(response);
                    $('#NewBookEntryFormModal').modal('hide');
                    alert('successfully updated!');
                })
                //console.log(newBookQuery);
                //$(this).trigger('reset');
                TableUpdate();
                return false;
            })
            return;
        } else if (obj.is('#newEntryButton')) {
            console.log("called by new entry button");
            $('#book-entry-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                var formInfo = $(this).serializeArray();
                var newBookQuery = 'INSERT INTO Books (BookName, AuthorName, CategoryID) VALUES(\"' + formInfo[1].value + "\", \"" + formInfo[2].value + "\", \"" + formInfo[3].value + '\")';
                console.log(newBookQuery);
                connection.query(newBookQuery, function (response) {
                    console.log(response);
                    alert("successfully inserted!");
                    $('#book-entry-form').trigger('reset');
                    // $('#message').removeClass('hide').addClass('alert alert-success alert-dismissable').slideDown().show();
                    // $('#message button span').html('&times;');
                    // $('#message-content').html('<p>Success!</p>')
                    // window.setTimeout(function() {
                    //     $(".alert").fadeTo(500, 0).slideUp(500, function(){
                    //         $(this).remove(); 
                    //     });
                    // }, 1000);
                })
                TableUpdate();
                return false;
            })
        } else {
            console.error("BookEntry called from unknown source");
        }

    }




    //calling BookEntryUpdate from NewEntryButton
    $('#newEntryButton').on('click', function () {
        $('#book-id').attr('type', 'hidden');
        $('#book-entry-form').trigger("reset");
        BookEntryUpdate($(this));
    })


    //return button modal
    $('#returnButton').off('click').on('click', function () {
        console.log('inside return button');

        $('#token-id').on('keypress', function (e) {
            if (e.which == 13) {
                let tid = $(this).val();
                //console.log(tid);


                //create a query to search for the given token id
                var transactionQuery = "select * from `StudentBooks` where `TransactionID` = \"" + tid + "\"";
                console.log(transactionQuery);
                connection.query(transactionQuery, function (err, rows, fields) {
                    if (rows.length === 0) {
                        //entry does not exist
                        alert("Wrong Token No.");
                    } else {
                        //console.log(rows);

                        $('#b-id > a').html(rows[0].BookID); //BookID
                        $('#stu-id > a').html(rows[0].StudentID); //StudentID
                        $('#issue-date > span').html(rows[0].IssueDate.toString().slice(0, 24)); //issued date
                        $('#status > span').html(rows[0].ActionType); //status: issued/returned

                        $('#return-popup div ul').toggle();

                        $('#return-submit').off('click').on('click', function() {
                            //...
                            var return_query = "insert into `StudentBooks`(StudentID, BookID, IssueDate, ActionType) values (\"" + rows[0].StudentID + "\", \"" + rows[0].BookID + "\", SYSDATE(), \"Returned\")";
                            //console.log(return_query);


                            //if there's odd no of BookID entry that means the return is possible
                            //if even, then you are trying to return something that is already retured
                            let countquery = "select count(*) count from `StudentBooks` where `BookID` = \"" + rows[0].BookID + "\"";
                            //console.log(countquery);
                            connection.query(countquery, function (err, rows, fields) {
                            
                                retCount = rows[0].count;
                                
                                if (retCount % 2 == 0) {
                                    alert("Book is already returned. Cannot re-return");
                                    $('#return-popup').modal('hide');
                                } else {
                                    //return is fine.
                                    connection.query(return_query, function (resonse) {
                                        $('#return-popup').modal('hide');
                                        $('#success-popup').modal('show');
                                    })
                                }
                            })
                        })

                    }
                })


            }
        })



    })
})
