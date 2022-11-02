<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/portal.css">
    <link rel="icon" type="image/x-icon" href="../madrasalogo.png">
    <title>Staff Portal</title>
</head>
<body>
    
        <!-- <div class="nav" id="navbar"> -->
        <ul class="navList">
            <li><div class="logo navItem"></div></li>
            <li><h2 class="navItem" style="margin-top: 10px" >MBNJ</h2></li>
            <li style="float: right;">
                <div class="dropdown">
                    <button class="dropbtn navItem" id="userName">MS
                      <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a>Moiz Sabir</a>
                        <a href="./login.html" onclick="logout()">Logout</a>
                    </div>
                  </div> 
            </li>
        </ul>


        <div class="alert alert-Nonactive" id="alertBox">
            Form Submitted
        </div>
        <div class="spacer"></div>

        <div class="tab" id="tab-div">
        </div>
        <div id="tabs">
            <?php 
                include('DivCa.html');  // class Attendance
            ?>
            <?php
                include('DivSl.html')   // student lookup
            ?>
            <?php
                include('DivSa.html')   // schedule absence
            ?>
            <?php
                include('DivCh.html')   // class history
            ?>
        </div>


<script src="../script/loadTabs.js"></script>
<script src="../script/logout.js"></script>
<script src=”https://unpkg.com/dayjs@1.8.21/dayjs.min.js”></script>
<script type="module" src="../script/calendar.js"></script>
</body>

</html>