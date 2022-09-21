<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="portal.css">
    <title>Staff Portal</title>
</head>

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
                        <a href="#">Logout</a>
                    </div>
                  </div> 
            </li>
        </ul>

        <div class="tab" id="tab-div">
        </div>
        <div id="tabs">
            <div id="London" class="tabcontent">
                <h3>London</h3>
                <p>London is the capital city of England.</p>
            </div>
        </div>


<script src="../script/loadTabs.js"></script>
</body>

</html>