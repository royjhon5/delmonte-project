<?php
date_default_timezone_set('Asia/Manila');
// get device logs from hikvision device
$mysqli_conn = new mysqli("localhost","root","","face_bio_db");
$device_username = "admin";
$device_password = "gsmpc2024";

// Check connection
if ($mysqli_conn->connect_errno) 
{
    echo "Failed to connect to MySQL: " . $mysqli_conn->connect_error;
    exit();
} else {
    echo "connected to database... <br><br>";
}

// if(isset($_GET['get_logs'])) {
    $sql="SELECT * FROM active_devices ORDER BY id";
    $result=$mysqli_conn->query($sql);
    $counter = 1;
    while($row = $result->fetch_assoc()) 
    {
        echo "Device " . $row['ip_address'] . " --- " . $row['last_datetime_update'] . "<br>";
        // if($counter == 1 or $counter == 2)
        // {
            // curl check device
            $ch = curl_init();
            $headers = [
                        'Content-Type: application/json',
                    ];
            $postData = [];
            curl_setopt($ch, CURLOPT_URL,"http://".$row['ip_address']."/ISAPI/AccessControl/UserInfo/capabilities?format=json");
            curl_setopt($ch, CURLOPT_USERPWD, $device_username . ":" . $device_password);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1); //timeout in seconds
            $device_online_check_response = curl_exec($ch);
            curl_close($ch);

            echo "<br>";
            echo "<br>";

            if($device_online_check_response) 
            {
                $total_rows = 0;
                $total_left = 1;
                $total_generated = 0;
                $time_start = explode(" ", $row['last_datetime_update'])[0] . "T" . explode(" ", $row['last_datetime_update'])[1] . "+08:00";
                $time_end = date('Y-m-d') . "T" . date('H:i:s') . "+08:00";
                var_dump($time_start);
                var_dump($time_end);
                // curl get device logs
                while($total_left > 0) {
                    $ch = curl_init();
                    $headers = [
                                'Content-Type: application/json',
                            ];
                    $postData = [
                        'AcsEventCond' => [
                            'searchID' => "fetch1",
                            'searchResultPosition' => $total_generated == 0 ? 0 : ($total_generated + 1), // total generate + 1
                            'maxResults' => 30, // max
                            'major' => 5,
                            'minor' => 0,
                            'startTime' => $time_start, // GMT +08
                            'endTime' => $time_end, // GMT +08
                        ],
                    ];
                    curl_setopt($ch, CURLOPT_URL,"http://".$row['ip_address']."/ISAPI/AccessControl/AcsEvent?format=json");
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_USERPWD, $device_username . ":" . $device_password);
                    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));           
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1); //timeout in seconds
                    $logs_response = curl_exec($ch);
                    curl_close($ch);
                    $response_raw = json_decode(utf8_encode($logs_response), true);
                    if($response_raw){
                        if(!empty(@$response_raw['AcsEvent']['totalMatches'])) {
                            $total_rows = $response_raw['AcsEvent']['totalMatches'];
                            $total_generated += $response_raw['AcsEvent']['numOfMatches'];
                            $total_left = $total_rows-$total_generated;
                            echo "matches: ".$response_raw['AcsEvent']['numOfMatches']." <br>";
                            echo "total: $total_rows <br>";
                            echo "left: $total_left <br>";
                            echo "generated: $total_generated <br>";
                            foreach($response_raw['AcsEvent']['InfoList'] as $record) {
                                if($record['currentVerifyMode']=='cardOrFaceOrFp' or $record['currentVerifyMode']=='faceOrFpOrCardOrPw'){
                                    if(!empty($record['employeeNoString'])) {
                                        var_dump($record['name']);
                                        var_dump($record['time']);
                                        var_dump($record['employeeNoString']);
                                        $datetime_raw = explode("T", $record['time']);
                                        $date = $datetime_raw[0];
                                        $time = explode("+", $datetime_raw[1])[0];
                                        $name = $record['name'];
                                        $chapa = $record['employeeNoString'];
                                        $sql="INSERT INTO device_logs (device_log_id, auth_datetime, auth_date, auth_time, person_name, chapa)
                                            VALUES (1, '".$date." ".$time."', '".$date."', '".$time."', '".$name."', '".$chapa."')";
                                        if (mysqli_query($mysqli_conn, $sql)) {
                                            echo "Successfully added.";
                                        } else {
                                            echo "Error: " . $sql . "<br>" . $mysqli_conn->error;
                                        }
                                        echo "<br>";
                                    }
                                }
                            }
                            if($response_raw['AcsEvent']['numOfMatches']==0 or $response_raw['AcsEvent']['numOfMatches']==$response_raw['AcsEvent']['numOfMatches']) {
                                $datetime_raw = explode("T", $time_end);
                                $date = $datetime_raw[0];
                                $time = explode("+", $datetime_raw[1])[0];
                                $sql="UPDATE active_devices SET last_datetime_update = '" . $date . " " . $time ."' WHERE ip_address = '".$row['ip_address']."'";
                                if (mysqli_query($mysqli_conn, $sql)) {
                                    echo "Successfully added event logs.";
                                } else {
                                    echo "Error: " . $sql . "<br>" . $mysqli_conn->error;
                                }
                                $total_left = 0;
                                break;
                            }
                        } else {
                            echo "no result";
                            $total_left = 0;
                        }
                    } else {
                        echo "no result";
                        $total_left = 0;
                    }
                }

                // insert logs to database here...

                // update last datetime update here...

                echo "<br>";
                echo "<br>";
            }
        // }
        $counter++;
    }
// }

if(isset($_GET['sample']))
{
    $sql="INSERT INTO active_devices (ip_address, last_datetime_update)
        VALUES ('192.168.1.1', '".date('Y-m-d H:i:s')."')";
    if ($mysqli_conn->query($sql) === TRUE) {
        echo "Successfully added.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
?>