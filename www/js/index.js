// Create or Open Database.

var db = window.openDatabase('CodoData', '1.0', 'Datax', 20000);

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPad|iPhone|Android|BlackBerry|Windows Phone|webOS)/)) {
    log('run');
    $(document).on('deviceready', onDeviceReady);
    //onDeviceReady();
}
else {
    onDeviceReady();
}

// To detect whether users use mobile phones horizontally or vertically.
$(window).on('orientationchange', onOrientationChange);

function onOrientationChange(e) {
    if (e.orientation == 'portrait') {
        console.log('Portrait.');
    }
    else {
        console.log('Landscape.');
    }
}

$(window).on("cordovacallbackerror", function (event) {
    console.log('ERROR: '+event.error);
});

// Display messages in the console.
function log(message) {
    console.log(`[${new Date()}] ${message}`);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
    log(`Errors when executing SQL query. [Code: ${error.code}] [Message: ${error.message}]`);
}

// Run this function after starting the application.
function onDeviceReady() {
    // Logging.
    log('Device is ready.');
    /*function DeleteTable(tx){
        tx.executeSql('DROP TABLE IF EXISTS Account');
        tx.executeSql('DROP TABLE IF EXISTS Apartment');
        tx.executeSql('DROP TABLE IF EXISTS Comment');
        tx.executeSql('DROP TABLE IF EXISTS Image');
        
    }

    function errorCB(err) {
        log("Error processing SQL: "+err);
    }

    function successCB() {
        log("Delete old Tables success!");
    }

    db.transaction(DeleteTable, errorCB, successCB);*/

    //Create Account Table
    db.transaction(function (tx) {
        var query = `CREATE TABLE IF NOT EXISTS Account (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Username TEXT NOT NULL UNIQUE,
                                                         Email TEXT NOT NULL UNIQUE,
                                                         Password TEXT NOT NULL,
                                                         Age INTEGER NULL,
                                                         Phone INTEGER NULL,
                                                         Address TEXT NULL,
                                                         Avatar BLOB NULL,
                                                         LastModify TEXT NULL )`;
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Account' successfully.`);
        }
    });

    //Create Apartment Table
    db.transaction(function (tx) {
        var query = `CREATE TABLE IF NOT EXISTS Apartment   (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                             AccountId INTEGER NOT NULL,
                                                             Address TEXT NOT NULL,
                                                             Price INTEGER NOT NULL,
                                                             Image BLOB NULL,
                                                             RoomNum TEXT NULL,
                                                             BedroomNum INTEGER NULL,
                                                             BathroomNum INTEGER NULL,
                                                             Area TEXT NULL,
                                                             Type TEXT NULL,
                                                             Status TEXT NULL,
                                                             Description TEXT NULL,
                                                             LastModify TEXT NULL,
                                                             FOREIGN KEY (AccountId) REFERENCES Account(Id) ON DELETE CASCADE ON UPDATE NO ACTION )`;

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Apartment' successfully.`);
        }
    });

    //Create Comment Table
    db.transaction(function (tx) {
        var query = `CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                                     AccountId INTEGER NOT NULL,
                                                                     ApartmentId INTEGER NOT NULL,
                                                                     Content TEXT NULL,
                                                                     LastModify TEXT NULL,
                                                                     FOREIGN KEY (AccountId) REFERENCES Account(Id) ON DELETE CASCADE ON UPDATE NO ACTION,
                                                                     FOREIGN KEY (ApartmentId) REFERENCES Apartment(Id) ON DELETE CASCADE ON UPDATE NO ACTION )`;

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Comment' successfully.`);
        }
    });

     //Create Image Table
    db.transaction(function (tx) {
    var query = `CREATE TABLE IF NOT EXISTS Image (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 AccountId INTEGER NULL,
                                                 ApartmentId INTEGER NULL,
                                                 Content BLOB NULL,
                                                 Type TEXT,
                                                 LastModify TEXT NULL,
                                                 FOREIGN KEY (AccountId) REFERENCES Account(Id) ON DELETE CASCADE ON UPDATE NO ACTION,
                                                 FOREIGN KEY (ApartmentId) REFERENCES Apartment(Id) ON DELETE CASCADE ON UPDATE NO ACTION )`;

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Image' successfully.`);
        }
    });

    
}

/*-----------------------OTHER--------------------------------*/
//Delete Local Storage
/*
localStorage.removeItem('UserId');
localStorage.removeItem('rentalId');
localStorage.removeItem('skip-login');
*/
//First enter app
$(document).on('pagebeforeshow', '#page-home', function(e){
    log('Over here' + db);
    if(localStorage.getItem('UserId') == null && localStorage.getItem('skip-login') == null){
        $.mobile.navigate('#page-login', { transition: 'slideup' });
        //$.mobile.pageContainer.pagecontainer("change", "login.html", {reloadPage: true});
    }
});

//Skip login
$(document).on('vclick', '#page-login #skip-login', function(e){
   localStorage.setItem('skip-login', 'skip');
    $.mobile.navigate('#page-home', { transition: 'fade' });
    //$.mobile.pageContainer.pagecontainer("change", "index.html", {reloadPage: true});
});

//Setting tab
$(document).on('pagebeforeshow', '#setting-page', function(e){
    if(localStorage.getItem('UserId') != null){
        $('#setting-page .page-content-wrapper .user-account').css('display', 'block');
        $('#setting-page .page-content-wrapper .setting-update-profile').css('display', 'block');
        $('#setting-page .page-content-wrapper .setting-change-password').css('display', 'block');
        $('#setting-page .page-content-wrapper .setting-logout').css('display', 'block');

        var id = localStorage.getItem('UserId');
        db.transaction(function(tx){
            var query = 'SELECT Username, Email ,Phone, Avatar FROM Account WHERE Id = ?';
            tx.executeSql(query, [id], transactionSuccess, transactionError);

            function transactionSuccess(tx, result){
                if(result.rows[0] != null){
                    $('#setting-page #setting-avatar').attr('src', result.rows[0].Avatar);
                    $('#setting-page #setting-username').text(result.rows[0].Username);
                    $('#setting-page #setting-email').text(result.rows[0].Email);
                    if(result.rows[0].Phone != null){
                        $('#setting-page #setting-phoneNumber').text(result.rows[0].Phone);
                    }else{
                        $('#setting-page #setting-phoneNumber').text('Not Set');
                    }
                }
            }
        });
    }else{
        $('#setting-page .page-content-wrapper .user-account').css('display', 'none');
        $('#setting-page .page-content-wrapper .setting-update-profile').css('display', 'none');
        $('#setting-page .page-content-wrapper .setting-change-password').css('display', 'none');
        $('#setting-page .page-content-wrapper .setting-logout').css('display', 'none');
    }
})

/********************************************************/
/*-----------------------ACCOUNT START--------------------------------*/
// Submit a form to register a new account.
$(document).on('submit', '#page-create #frm-register', confirmAccount);
function confirmAccount(e){

    e.preventDefault();
    // Get user's input.
        var email = $('#page-create #frm-register #email').val();
        var username = $('#page-create #frm-register #username').val();
        var password = $('#page-create #frm-register #password').val();
        var password_confirm = $('#page-create #frm-register #password-confirm').val();

        if (password != password_confirm) {
            $('#page-create #frm-register #password-confirm')[0].setCustomValidity('Password not match.');
        }
        else
        {
            db.transaction(function (tx){
                var query = 'SELECT * FROM Account WHERE Username = ? OR Email = ?';
                tx.executeSql(query, [username, email], transactionSuccess, transactionError);

                function transactionSuccess(tx, result){
                    if(result.rows[0] == null){
                        $('#page-create #frm-register-confirm #email').text(email);
                        $('#page-create #frm-register-confirm #username').text(username);
                        $('#page-create #frm-register-confirm #password').text(password);
                        $('#page-create #create-account-confirm').popup('open');
                        console.log('print');
                    }else{
                        alert('Account existed');
                    }
                }
            });
        }

}

$(document).on('submit', '#frm-register-confirm', registerAccount);
function registerAccount(e) {
    e.preventDefault();

    var email = $('#page-create #frm-register-confirm #email').text();
    var username = $('#page-create #frm-register-confirm #username').text();
    var password = $('#page-create #frm-register-confirm #password').text();
    var avatar = 'https://placekitten.com/300/300'
    var date = new Date().toLocaleString();

    db.transaction(function (tx) {
        var query = 'INSERT INTO Account (Email, Username, Password, Avatar, LastModify) VALUES (?, ?, ?, ?, ?)';
        tx.executeSql(query, [email, username, password, avatar, date], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            UserSession(username);
            log(`Create a username '${username}' successfully.`);

            // Reset the form.
            $('#frm-register').trigger('reset');
            $('#username').focus();

            $('#page-create #create-account-confirm').popup('close');
        }
    });
}

//Login Account
$(document).on('submit', '#page-login #frm-login', LoginAccount);
function LoginAccount(e){
    e.preventDefault();

    var username = $('#page-login #frm-login #username').val();
    var password = $('#page-login #frm-login #password').val();
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Account WHERE Username = ? AND Password = ?'
        tx.executeSql(query, [username, password], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
           if(result.rows[0] == null){
                alert('Your username or password incorrect. Please try again!');
           }else{
                alert('Login successful');
                UserSession(username);
           }
        }
    });
}

//Save User Session
function UserSession(username){
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Account WHERE Username = ?';
        tx.executeSql(query, [username], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            if(result.rows[0] !== null){
                localStorage.setItem('UserId', result.rows[0].Id);

                $.mobile.navigate('#apartment-list-page');
            }else{
                log('Save Session Fail!');
            }
        }

    });
}





//Logout
$(document).on('vclick', '#setting page #logout-btn', function(e){
    localStorage.removeItem('UserId');
    $.mobile.pageContainer.pagecontainer("change", "index.html", {reloadPage: true});
});

/*---------------------------------ACCOUNT END----------------------------------------*/
//**************************************************************************************
/*-------------------------------APARTMENT START--------------------------------------*/

$(document).on('vclick', '#post-rental-info-page #create-rental-btn', function(){
    log('run');
    if(localStorage.getItem('UserId') == null){
        $.mobile.pageContainer.pagecontainer("change", "index.html", {reloadPage: true});
    }else{
        $.mobile.navigate('#create-rental-page', { transition: 'slidedown' });
    }
});

//Fill Rental Apartment Info
$(document).on('submit', '#create-rental-page #frm-fill-rental-info', FillRentalInfo)
function FillRentalInfo(e){
    e.preventDefault();

    var imgData = $('#create-rental-page #frm-fill-rental-info .ImageUpload').attr('src');

    var id = localStorage.getItem('UserId');
    var address = $('#create-rental-page #frm-fill-rental-info #address').val();
    var price = $('#create-rental-page #frm-fill-rental-info #price').val();
    var room = $('#create-rental-page #frm-fill-rental-info #room').val();
    var bed = $('#create-rental-page #frm-fill-rental-info #bed').val();
    var bath = $('#create-rental-page #frm-fill-rental-info #bath').val();
    var area = $('#create-rental-page #frm-fill-rental-info #area').val();
    var type = $('#create-rental-page #frm-fill-rental-info #type').val();
    var status = $('#create-rental-page #frm-fill-rental-info #status').val();
    var description = $('#create-rental-page #frm-fill-rental-info #notes').val();
    var date = new Date().toLocaleString();

    db.transaction(function (tx){
        var query = 'INSERT INTO Apartment (AccountId, Address, Price, Image, RoomNum, BedroomNum, BathroomNum, Area, Type, Status, Description, LastModify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

        tx.executeSql(query, [id, address, price, imgData, room, bed, bath, area, type, status, description, date], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            alert(`Post information Data successfully.`);

            // Reset the form.
            $('#create-rental-page #frm-fill-rental-info').trigger('reset');
            location.reload();
        }
    });
}

//////////////////// SHOW LIST
//Display Rental List Of User Login
$(document).on('pagebeforeshow', '#post-rental-info-page', ShowRentalList);
function ShowRentalList(){
    db.transaction(function (tx) {
        var query = 'SELECT Id, Price, Address, Image, BedroomNum, BathroomNum, Area,RoomNum,Type FROM Apartment WHERE AccountId = ?';
        tx.executeSql(query, [localStorage.getItem('UserId')], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of apartment successfully.`);

            ShowRentalListUI(result.rows);
        }
    });
}

// Rental apartment list UI at APARTMENT MANAGER(PostRentalInfo.html)
function ShowRentalListUI(list){
   var listApartment = '';
   for (let item of list) {
       listApartment += `<div class="col-12">
                             <div class="card single-product-card">
                                  <div class="card-body p-0">
                                  <div style="background-image: url('https://image.freepik.com/free-vector/hand-painted-watercolor-nature-background_23-2148941599.jpg');">
                                      <div class="d-flex align-items-center">
                                         <div class="card-side-img">
                                             <!-- Product Thumbnail-->
                                             <a class="product-thumbnail d-block" data-details='{"Id" : ${ item.Id}}'></a>
                                         </div>
                                         <a class="link-view-detail" style="width: calc(100% - 60px);" data-details='{"Id" : ${ item.Id}}'>
                                         <div class="card-content px-2 py-2 " >
                                         <div class="table-users">
   
   
                                         <table>
                                         <tr>
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                            &emsp;
                                            <th></th>
                                         </tr>
                                   
                                         
                                   
                                         <tr>
                                            <td><img src="${item.Image}" alt="" /></td>
                                            &emsp;
                                            <td>$ ${item.Price}<span>/month</span></td>
                                            &emsp;
                                            <td>Property name ${item.Area}</td>
                                            &emsp;
                                            <td>name of reporter ${item.RoomNum }</td>
                                            &emsp;
                                            <td><p class="m-0 w-100"><span id="bedroom">Bedroom ${item.BedroomNum}</span><i class="fas fa-bed px-1"></i><span class="px-2">|</span><span class="pr-2" id="bathroom">Bathroom ${item.BathroomNum}</span><i class="fas fa-bath px-1"></i> </p></td>
                                            <td>Address: ${item.Address}</td>
                                            <td>Type: ${item.Type}</td>
                                            <td><p >posted date <a id="rental-date-modify"></a></p></td>
                                            <td><i class="fas fa-bell" style="font-size:24px"></i><span class="px-2">|</span><i class="bi bi-phone-vibrate" style="font-size:24px"></i></td>
                                            
                                         
                                         
                                            </tr>
                                   
                                      </table>
                                      </div>
                                            
                                         </div>
                                         </a>
                                         <!-- Options-->
                                         <div data-role="none" class="dropstart p-2">
                                             <button data-role="none" class="btn btn-info" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-caret-down"></i></button>
                                             <ul data-role="none" class="dropdown-menu p-1 dropdown-menu-post">
                                                 
                                                 <li><button id='keu' class="update-rental" href="#" data-transition="fade" data-details='{"Id" : ${item.Id}}'>Edit</button></li>
                                                 <li><button id='rung' class="delete-rental" href="#"  data-details='{"Id" : ${item.Id}}'>Delete</button></li>
                                             </ul>
                                         </div>
                                     </div>
                                  </div>
                             </div>
                         </div>
                    
<style>$baseColor: #398B93;
$borderRadius: 10px;
$imageBig: 100px;
$imageSmall: 60px;
$padding: 10px;


body {
   background-color: lighten($baseColor, 30%);
   * { box-sizing: border-box; }
}

.header {
   background-color: darken($baseColor, 5%);
   color: white;
   font-size: 1.5em;
   padding: 1rem;
   text-align: center;
   text-transform: uppercase;
}

img {
   border-radius: 50%;
   height: $imageSmall;
   width: $imageSmall;
}

.table-users {
   border: 1px solid darken($baseColor, 5%);
   border-radius: $borderRadius;
   box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
   max-width: calc(100% - 2em);
   margin: 1em auto;
   overflow: hidden;
   width: 800px;
}

table {
   width: 100%;
   
   td, th { 
      color: darken($baseColor, 10%);
      padding: $padding; 
   }
   
   td {
      text-align: center;
      vertical-align: middle;
      
      &:last-child {
         font-size: 0.95em;
         line-height: 1.4;
         text-align: left;
      }
   }
   
   th { 
      background-color: lighten($baseColor, 50%);
      font-weight: 300;
   }
   
   tr {     
      &:nth-child(2n) { background-color: white; }
      &:nth-child(2n+1) { background-color: lighten($baseColor, 55%) }
   }
}

@media screen and (max-width: 700px) {   
   table, tr, td { display: block; }
   
   td {
      &:first-child {
         position: absolute;
         top: 50%;
         transform: translateY(-50%);
         width: $imageBig;
      }

      &:not(:first-child) {
         clear: both;
         margin-left: $imageBig;
         padding: 4px 20px 4px 90px;
         position: relative;
         text-align: left;

         &:before {
            color: lighten($baseColor, 30%);
            content: '';
            display: block;
            left: 0;
            position: absolute;
         }
      }

      &:nth-child(2):before { content: 'Name:'; }
      &:nth-child(3):before { content: 'Email:'; }
      &:nth-child(4):before { content: 'Phone:'; }
      &:nth-child(5):before { content: 'Comments:'; }
   }
   
   tr {
      padding: $padding 0;
      position: relative;
      &:first-child { display: none; }
   }
}

@media screen and (max-width: 500px) {
   .header {
      background-color: transparent;
      color: lighten($baseColor, 60%);
      font-size: 2em;
      font-weight: 700;
      padding: 0;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.1);
   }
   
   img {
      border: 3px solid;
      border-color: lighten($baseColor, 50%);
      height: $imageBig;
      margin: 0.5rem 0;
      width: $imageBig;
   }
   
   td {
      &:first-child { 
         background-color: lighten($baseColor, 45%); 
         border-bottom: 1px solid lighten($baseColor, 30%);
         border-radius: $borderRadius $borderRadius 0 0;
         position: relative;   
         top: 0;
         transform: translateY(0);
         width: 100%;
      }
      
      &:not(:first-child) {
         margin: 0;
         padding: 5px 1em;
         width: 100%;
         
         &:before {
            font-size: .8em;
            padding-top: 0.3em;
            position: relative;
         }
      }
      
      &:last-child  { padding-bottom: 1rem !important; }
   }
   
   tr {
      background-color: white !important;
      border: 1px solid lighten($baseColor, 20%);
      border-radius: $borderRadius;
      box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
      margin: 0.5rem 0;
      padding: 0;
   }
   
   .table-users { 
      border: none; 
      box-shadow: none;
      overflow: visible;
   }
}</style>`;

   }

   $('#list-apartment').empty().append(listApartment).listview('refresh').trigger('create');
}

//Display All Rental List
$(document).on('pagebeforeshow', '#apartment-list-page', ShowAllRentalList);
function ShowAllRentalList(){
    db.transaction(function (tx) {
        var query = 'SELECT Id, Price, Address, Image, BedroomNum, BathroomNum,Area,RoomNum,Type FROM Apartment';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of apartment successfully.`);

            ShowAllRentalListUI(result.rows);
        }
    });
}

// Rental apartment list UI in APARTMENT LIST(ApartmentList.html)
function ShowAllRentalListUI(list){
    var listApartment = '';
    for (let item of list) {
        listApartment += `<div class="col-12 p-0">
                              <div class="apartment-list">
                                  <a class="show-rental-detail-btn" href="#" data-details='{"Id" : ${item.Id}}'>
                                  <div style="background-image: url('https://image.freepik.com/free-vector/hand-painted-watercolor-nature-background_23-2148941599.jpg');">
                                        
                                        <div class="table-users">
   
   
   <table cellspacing="0">
      <tr>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
         <th></th>
      </tr>

      <tr>
         <td><img src="${item.Image}" alt="" /></td>
         <td></td>
         <td><p class="m-0 w-100" >$${item.Price}<span>/month</span></p></td>
         <td></td>
         <td><p class="m-0 w-100" style="text-align: right;"><span id="bedroom">Bedroom: ${item.BedroomNum}</span><i class="fas fa-bed px-1"></i><span class="px-2">|</span><span class="pr-2" id="bathroom">Bathroom: ${item.BathroomNum}</span><i class="fas fa-bath px-1"></i> </p></td>
         <td></td>
         <td><p class="m-0 w-100 textWrapping">Address: ${item.Address}</p></td>
         <td></td>
         <td><p class="m-0 w-100" >Property name ${item.Area}</p></td>
         <td></td>
         <td><p class="m-0 w-100" >Name of the reporter ${item.RoomNum }</p></td>
         <td></td>
         <td><p class="m-0 w-100" >Type ${item.Type}</p></td>
         <td></td>
         <td><p >posted date <a id="rental-date-modify"></a></p></td>
      </tr>
      

   </table>
</div>
<style>$baseColor: #398B93;
$borderRadius: 10px;
$imageBig: 100px;
$imageSmall: 60px;
$padding: 10px;


body {
   background-color: lighten($baseColor, 30%);
   * { box-sizing: border-box; }
}

.header {
   background-color: darken($baseColor, 5%);
   color: white;
   font-size: 1.5em;
   padding: 1rem;
   text-align: center;
   text-transform: uppercase;
}

img {
   border-radius: 50%;
   height: $imageSmall;
   width: $imageSmall;
}

.table-users {
   border: 1px solid darken($baseColor, 5%);
   border-radius: $borderRadius;
   box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
   max-width: calc(100% - 2em);
   margin: 1em auto;
   overflow: hidden;
   width: 800px;
}

table {
   width: 100%;
   
   td, th { 
      color: darken($baseColor, 10%);
      padding: $padding; 
   }
   
   td {
      text-align: center;
      vertical-align: middle;
      
      &:last-child {
         font-size: 0.95em;
         line-height: 1.4;
         text-align: left;
      }
   }
   
   th { 
      background-color: lighten($baseColor, 50%);
      font-weight: 300;
   }
   
   tr {     
      &:nth-child(2n) { background-color: white; }
      &:nth-child(2n+1) { background-color: lighten($baseColor, 55%) }
   }
}

@media screen and (max-width: 700px) {   
   table, tr, td { display: block; }
   
   td {
      &:first-child {
         position: absolute;
         top: 50%;
         transform: translateY(-50%);
         width: $imageBig;
      }

      &:not(:first-child) {
         clear: both;
         margin-left: $imageBig;
         padding: 4px 20px 4px 90px;
         position: relative;
         text-align: left;

         &:before {
            color: lighten($baseColor, 30%);
            content: '';
            display: block;
            left: 0;
            position: absolute;
         }
      }

      &:nth-child(2):before { content: 'Name:'; }
      &:nth-child(3):before { content: 'Email:'; }
      &:nth-child(4):before { content: 'Phone:'; }
      &:nth-child(5):before { content: 'Comments:'; }
   }
   
   tr {
      padding: $padding 0;
      position: relative;
      &:first-child { display: none; }
   }
}

@media screen and (max-width: 500px) {
   .header {
      background-color: transparent;
      color: lighten($baseColor, 60%);
      font-size: 2em;
      font-weight: 700;
      padding: 0;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.1);
   }
   
   img {
      border: 3px solid;
      border-color: lighten($baseColor, 50%);
      height: $imageBig;
      margin: 0.5rem 0;
      width: $imageBig;
   }
   
   td {
      &:first-child { 
         background-color: lighten($baseColor, 45%); 
         border-bottom: 1px solid lighten($baseColor, 30%);
         border-radius: $borderRadius $borderRadius 0 0;
         position: relative;   
         top: 0;
         transform: translateY(0);
         width: 100%;
      }
      
      &:not(:first-child) {
         margin: 0;
         padding: 5px 1em;
         width: 100%;
         
         &:before {
            font-size: .8em;
            padding-top: 0.3em;
            position: relative;
         }
      }
      
      &:last-child  { padding-bottom: 1rem !important; }
   }
   
   tr {
      background-color: white !important;
      border: 1px solid lighten($baseColor, 20%);
      border-radius: $borderRadius;
      box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
      margin: 0.5rem 0;
      padding: 0;
   }
   
   .table-users { 
      border: none; 
      box-shadow: none;
      overflow: visible;
   }
}</style>

                                   `;
        }
    $('#list-apartment').empty().append(listApartment).listview('refresh').trigger('create');
}







//////////////// SHOW DETAIL
//Click event show rental apartment detail at APARTMENT MANAGER (PostRentalInfo.html)
$(document).on('vclick', '#post-rental-info-page #list-apartment div div div div .link-view-detail', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('rentalId', id);

    $.mobile.navigate('#rental-detail-page', { transition: 'none' });
});

// Click event show rental Apartment Detail in APARTMENT LIST
$(document).on('vclick', '#apartment-list-page #list-apartment .show-rental-detail-btn', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('rentalId', id);

    $.mobile.navigate('#rental-detail-page', { transition: 'none' });
});



//Show Rental Detail Command
$(document).on('pagebeforeshow', '#rental-detail-page', ShowRentalDetail);
function ShowRentalDetail(){
    var id = localStorage.getItem('rentalId');
    console.log('run ' + id);
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Apartment WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var errorMessage = 'Account not found.';
            var ImageData, price, BedroomNum, BathroomNum, area, status, address, description, date = '',type;

            if (result.rows[0] != null) {
                ImageData = result.rows[0].Image;
                price = result.rows[0].Price;
                BedroomNum = result.rows[0].BedroomNum;
                BathroomNum = result.rows[0].BathroomNum;
                area = result.rows[0].Area;
                status = result.rows[0].Status;
                address = result.rows[0].Address;
                description = result.rows[0].Description;
                date = result.rows[0].LastModify;
                type= result.rows[0].Type;
            }
            else {
                log(errorMessage);
            }

            $('#rental-detail-page #rental-img').attr('src', ImageData);
            $('#rental-detail-page #price').text(price);
            $('#rental-detail-page #bedroom').text(BedroomNum);
            $('#rental-detail-page #bathroom').text(BathroomNum);
            $('#rental-detail-page #sqft').text(area);
            $('#rental-detail-page #status').text(status);
            $('#rental-detail-page #address').text(address);
            $('#rental-detail-page #description').text(description);
            $('#rental-detail-page #type').text(type);
            $('#rental-detail-page #rental-date-modify').text(date);
            $('#rental-detail-page #rental-date-modify').text(date);
            

            //showComment();
            showComment();
        }
    });
}







////////////// DELETE
//Delete Rental
function DeleteRental(id){
    db.transaction(function (tx) {
        var query = 'DELETE FROM Apartment WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Delete rental '${id}' successfully.`);
            localStorage.removeItem('rentalId');
        }
    });
}

// Delete at Apartment LIST
$(document).on('vclick', '#post-rental-info-page #list-apartment div div div div .delete-rental', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;

    var message = 'Are you sure to remove this rental info.';
   var title = 'Delete Confirm';
   var buttonLabel = 'Confirm,Cancel';

   navigator.notification.confirm(message, callback, title, buttonLabel);
   function callback(btnIndex) {
       if (btnIndex == 1) {

        DeleteRental(id);

        ShowRentalList();
       }
   }

});

//Delete at Apartment DETAIL
$(document).on('vclick', '#rental-detail-page .header-area #delete-detail-rental', function (e) {
   e.preventDefault();

   var id = localStorage.getItem('rentalId');

   DeleteRental(id);

    $.mobile.navigate('#post-rental-info-page', { transition: 'none' });
});


/////////////// UPDATE
//Show Default Value(the existing data)
$(document).on('pagebeforeshow', '#edit-rental-page', function(e){
    e.preventDefault();

    var id = localStorage.getItem('rentalId');

    DefaultRentalValue(id);
});
$(document).on('pagebeforeshow', '#edit-rental-page', DefaultRentalValue);

function DefaultRentalValue(id){
    db.transaction(function(tx){
        var query = 'SELECT *FROM Apartment WHERE Id = ?';

        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            if(result.rows[0] != null){
                $('#edit-rental-page #frm-edit-rental .ImageUpload').attr('src', result.rows[0].Image ).addClass('hasImage');

                $('#edit-rental-page #frm-edit-rental #address').val(result.rows[0].Address);
                $('#edit-rental-page #frm-edit-rental #price').val(result.rows[0].Price);
                $('#edit-rental-page #frm-edit-rental #room').val(result.rows[0].RoomNum);
                $('#edit-rental-page #frm-edit-rental #bed').val(result.rows[0].BedroomNum);
                $('#edit-rental-page #frm-edit-rental #bath').val(result.rows[0].BathroomNum);
                $('#edit-rental-page #frm-edit-rental #area').val(result.rows[0].Area);
                $('#edit-rental-page #frm-edit-rental #type').val(result.rows[0].Type);
                $('#edit-rental-page #frm-edit-rental #status').val(result.rows[0].Status);
                $('#edit-rental-page #frm-edit-rental #notes').val(result.rows[0].Description);
            }
        }
    });
}

//Update Function
$(document).on('submit', '#edit-rental-page #frm-edit-rental', UpdateApartment);

function UpdateApartment(e){
    e.preventDefault();

    var imgData = $('#edit-rental-page #frm-edit-rental .ImageUpload').attr('src');

    var id = localStorage.getItem('rentalId');
    var address = $('#edit-rental-page #frm-edit-rental #address').val();
    var price = $('#edit-rental-page #frm-edit-rental #price').val();
    var room = $('#edit-rental-page #frm-edit-rental #room').val();
    var bed = $('#edit-rental-page #frm-edit-rental #bed').val();
    var bath = $('#edit-rental-page #frm-edit-rental #bath').val();
    var area = $('#edit-rental-page #frm-edit-rental #area').val();
    var type = $('#edit-rental-page #frm-edit-rental #type').val();
    var status = $('#edit-rental-page #frm-edit-rental #status').val();
    var description = $('#edit-rental-page #frm-edit-rental #notes').val();
    var date = new Date().toLocaleString();

    db.transaction(function (tx) {
        var query = 'UPDATE Apartment SET Address = ?, Price = ?, Image = ?, RoomNum = ?, BedroomNum = ?, BathroomNum = ?, Area = ?, Type = ?, Status = ?, Description = ?, LastModify = ? WHERE Id = ?';
        tx.executeSql(query, [address, price, imgData ,room, bed, bath, area, type, status, description, date, id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            alert('Update Apartment Success');
            $('.ImageUpload').removeAttr('src');
            $.mobile.navigate('#post-rental-info-page', { transition: 'fade', reloadPage: true });
        }
    });

}

//Update Button at Apartment LIST
$(document).on('vclick', '#post-rental-info-page #list-apartment div div div div .update-rental', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('rentalId', id);
    DefaultRentalValue(id);

    $.mobile.navigate('#edit-rental-page', { transition: 'fade' });
});

//Update Button at Apartment Detail
$(document).on('vclick', '#rental-detail-page .header-area #update-detail-rental', function (e) {
    e.preventDefault();

    var id = localStorage.getItem('rentalId');

    DefaultRentalValue(id);

    $.mobile.navigate('#edit-rental-page', { transition: 'fade' });
});

////////////// SEARCH
//Search Rental Apartment at Apartment Manager
$(document).on('vclick', '#post-rental-info-page #frm-rental-search span', SearchRentalApartment);
$(document).on('keypress', '#post-rental-info-page #frm-rental-search input' ,function (e) {
     if(e.which === 13){
        SearchRentalApartment(e);
     }
});

function SearchRentalApartment(e){
    e.preventDefault();
    var keyWord = $('#post-rental-info-page #frm-rental-search #search-key-word').val();

    db.transaction(function(tx){
        var query = 'SELECT Id, Price, Image, Address, BedroomNum, BathroomNum,Area,Description,Type FROM Apartment WHERE';

        query += ` Address LIKE "%${keyWord}%"   AND`;

        query = query.substring(0, query.length - 6);

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            log('Get list apartment successful');

            ShowRentalListUI(result.rows);
        }
    })
}

// Search Apartment in User Apartment List
$(document).on('vclick', '#apartment-list-page #frm-rental-search span', SearchAllRentalApartment);
$(document).on('keypress', '#apartment-list-page #frm-rental-search input' ,function (e) {
     if(e.which === 13){
        SearchAllRentalApartment(e);
     }
});

function SearchAllRentalApartment(e){
    e.preventDefault();
    var keyWord = $('#apartment-list-page #frm-rental-search #search-key-word').val();

    db.transaction(function(tx){
        var query = 'SELECT Id, Price, Image, Address, BedroomNum, BathroomNum,Area,Description,Type FROM Apartment WHERE';

        query += ` Address  LIKE "%${keyWord}%"   AND`;
        

        query = query.substring(0, query.length - 6);

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            log('Get list apartment successful');

            ShowAllRentalListUI(result.rows);
        }
    })
}



/*-------------------------------------APARTMENT END-----------------------------------------*/
//*****************************************************************************************
/*-------------------------------------COMMENT START-------------------------------------------*/

//Add Comment
$(document).on('submit', '#frm-post-comment', PostComment);
function PostComment(e){
    e.preventDefault();

    var userId = localStorage.getItem('UserId');
    var RentalId = localStorage.getItem('rentalId');
    var Content = $('#frm-post-comment #comment-content').val();
    var date = new Date().toLocaleString();

    db.transaction(function(tx){
        var query = 'INSERT INTO Comment (AccountId, ApartmentId, Content, LastModify) VALUES (?,?,?,?)';

        tx.executeSql(query, [userId, RentalId, Content, date], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            log('Post Comment Success');

            $('#frm-post-comment #comment-content').trigger('reset');

            showComment();
        }
    });
}

//Show Comment
$(document).on('pagebeforeshow', '#list-comment', showComment);
function showComment(){
    var userId = localStorage.getItem('UserId');
    var RentalId = localStorage.getItem('rentalId');

    db.transaction(function (tx){
        var query = 'SELECT Avatar, Username, Comment.Id, AccountId, Content, Comment.LastModify FROM Comment INNER JOIN Account ON Account.Id = Comment.AccountId WHERE ApartmentId = ?';
        tx.executeSql(query, [RentalId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result){
            log('Show list of comments successfully');

            var listComment = '';
            for(let item of result.rows){
                if(item.AccountId == localStorage.getItem('UserId')){
                    listComment += `<li class="single-user-review d-flex">
                                        <div class="user-thumbnail mt-0"><img src="${item.Avatar}" alt=""></div>
                                        <div class="rating-comment" style="width: calc(100% - 40px)">
                                            <h4 class="my-0" style="font-size:1rem">${item.Username}</h4>
                                            <p class="comment mb-1">${item.Content}</p><span class="name-date">${item.LastModify}</span>
                                        </div>
                                        <div>
                                        <button class="remove-comment py-4"><a href="#" class="p-3 text-danger" data-details='{"Id" : ${item.Id}}'>Delete</button></div>
                                    </li>`;
                }else{
                    listComment += `<li class="single-user-review d-flex">
                                        <div class="user-thumbnail mt-0"><img src="${item.Avatar}" alt=""></div>
                                        <div class="rating-comment">
                                            <h4 class="my-0" style="font-size:1rem">${item.Username}</h4>
                                            <p class="comment mb-1">${item.Content}</p><span class="name-date">${item.LastModify}</span>
                                        </div>
                                    </li>`;
                }

            }

            $('#list-comment').empty().append(listComment).listview('refresh').trigger('create');
        }
    } );
}

//Delete Comment
$(document).on('vclick', '#list-comment li .remove-comment a', function(){
    var id = $(this).data('details').Id;

    db.transaction(function(tx){
        var query = 'DELETE FROM Comment WHERE Id = ?';

         tx.executeSql(query, [id], transactionSuccess, transactionError);

         function transactionSuccess(tx, result) {
             log(`Delete Account '${id}' successfully.`);

             showComment();
         }
    });

});


/*--------------------------------------COMMENT END--------------------------------------------*/
//**********************************************************************************************
/*----------------------------------------------------------------------------------*/

// Display Account List.
$(document).on('pagebeforeshow', '#page-list', showList);

function showList() {
    db.transaction(function (tx) {
        var query = 'SELECT Id, Username FROM Account';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of accounts successfully.`);

            // Prepare the list of accounts.
            var listAccount = `<ul id='list-account' data-role='listview' data-filter='true' data-filter-placeholder='Search accounts...'
                                                     data-corners='false' class='ui-nodisc-icon ui-alt-icon'>`;
            for (let account of result.rows) {
                listAccount += `<li><a data-details='{"Id" : ${account.Id}}'>
                                    <img src='img/boyscout_logo.jpg'>
                                    <h3>Username: ${account.Username}</h3>
                                    <p>ID: ${account.Id}</p>
                                </a></li>`;
            }
            listAccount += `</ul>`;

            // Add list to UI.
            $('#list-account').empty().append(listAccount).listview('refresh').trigger('create');
        }
    });
}



$(document).on('pagebeforeshow', '#apartment-list-page', ShowRentalDetailx);
function ShowRentalDetailx(){
    var id = localStorage.getItem('rentalId');
    console.log('run ' + id);
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Apartment WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var errorMessage = 'Account not found.';
            var  date = '';

            if (result.rows[0] != null) {
                
                date = result.rows[0].LastModify;
            }
            else {
                log(errorMessage);
            }

            
            $('#apartment-list-page #rental-date-modify').text(date);
            

            //showComment();
            showComment();
        }
    });
}
$(document).on('pagebeforeshow', '#post-rental-info-page', ShowRentalDetailxx);
function ShowRentalDetailxx(){
    var id = localStorage.getItem('rentalId');
    console.log('run ' + id);
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Apartment WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var errorMessage = 'Account not found.';
            var  date = '';

            if (result.rows[0] != null) {
                
                date = result.rows[0].LastModify;
            }
            else {
                log(errorMessage);
            }

            
            $('#post-rental-info-page #rental-date-modify').text(date);
            

            //showComment();
            showComment();
        }
    });
}

$(document).on('vclick', '#keu', cordovabeep);

function cordovabeep() {
    navigator.notification.beep(2);

}

$(document).on('vclick', '#rung', cordovavip);

function cordovavip() {
    navigator.vibrate([3000]);

}

$(document).on('vclick', '#picturehinh', takePicture);

function takePicture() {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: true
    }

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        alert(imageData);

        $('#img-01').attr('src', `data:image/jpeg;base64,${imageData}`);
    }

    function error(error) {
        alert(`Failed to take picture. Error: ${error}.`);
    }
}