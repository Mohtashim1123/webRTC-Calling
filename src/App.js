import React, { Component } from 'react';
import $ from "jquery";
// import intrfaxeRtc from './webrtcConnect';
// import Intrfaxe from './webrtcCore';
import "./App.css";
import Logo from './assets/media/iwhite.png'
class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showDisplayname: false,
            showRoom: false
        };
        this.initAllPlugins = this.initAllPlugins.bind(this);
        this.registerUsername = this.registerUsername.bind(this);
        this.ifPublicUrlConnectToRoomDirectly = this.ifPublicUrlConnectToRoomDirectly.bind(this);
    }

    componentDidMount() {
        this.initAllPlugins();
        this.registerUsername();
        $(document).on('click', '#stopButtonHeader', function() {
            window.stop(); // destroys the room connection
        })

        $(document).on('click', '#showscreenshareRoomDynamicId', function() {
            $("#room").show();
            // checkEnterShare(event);
        })

        $(document).on('click', '#showRoomDynamicId', function() {
            window.copyToClipBoard( window.location.origin + window.location.pathname + "?room=" + btoa($(this).attr('roomname') + "_roomid_codelabs_"+$(this).attr('roomid')) , $('body'), $(this).attr('roomid'))
        })
        
        $(document).on('click', '#showRoomId', function() {
            window.copyToClipBoard($(this).attr('roomid'), $('body'), $(this).attr('roomid'))
        })
    }

    initAllPlugins = () => {
        //make local video container draggable
        // $( ".localVideoContainer" ).draggable({
        //     containment: "parent"
        // });
        // $( ".localVideoContainer" ).resizable()

        var _btnSel = $('#createRoomBtn');
        $('#roomOptionSelect').on('change', function() {
            var _val = $(this).val();
            var _roomSelector = $('#roomName');
            const _room_label = $("#room_label");
            if(_val == 2) {
                // _roomSelector.val("1234").attr('disabled', true);
                _btnSel.text("Join");
                _room_label.html("Enter room ID");
                
            } else {
                // _roomSelector.val("").attr('disabled', false);
                _btnSel.text("Create");
                _room_label.html("Enter room name");
            }
        })

        _btnSel.on('click', function(){
            var roomName = $('#roomName').val();
            if(!roomName.length || roomName == "") {
                alert("enter room name");
                return;
            } else {
                // show next step for username and hide room box
                $('.roomSelectionMainBox').css('display', 'none');
                $('.registrationUserForm').css('display', 'flex');
            }
        })

        // Validate the username for connecting
        var usernameField = $('#userName');
        // Execute a function when the user releases a key on the keyboard
        usernameField.on("keyup", function(event) {
            var value = event.target.value;
            // console.log(value)
            if(value == "" || /[^a-zA-Z0-9 ]/.test(value)) { // if empty
                usernameField.addClass('is-invalid').removeClass('is-valid');
            } else {
                usernameField.removeClass('is-invalid').addClass('is-valid');
            }

            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                $('#enterToRoom').trigger('click');
            }
        }.bind(this));

    }

    registerUsername = () => {

        if($('#userName').val().length === 0) {
            // Create fields to register
            $('#enterToRoom').click(this.registerUsername);
            $('#userName').focus();
        } else {
            // Try a registration
            var username = $('#userName').val();
            if(username === "") {
                return;
            }
            if(/[^a-zA-Z0-9 ]/.test(username)) {
                return;
            }
            var urlParams = new URLSearchParams(window.location.search);
            console.log("connect")
            // connect to the room

            window.connect({
                isCreateRoom : $('#roomOptionSelect').val() == "2" ? false : true,
                room : ($('#roomName').val()).replace('codelabs_', ''),
                roomNameOnly : urlParams.has('room') ? ((atob(urlParams.get('room'))).split('_roomid_'))[0] : null,
                username: username
            });
            // console.log(myid + '-'+ mypvtid + '-'+ bootbox  + '-'+ toastr  + '-'+ Spinner  + '-'+ addSimulcastButtons  + '-'+ updateSimulcastButtons);

            // if(video) {
            // }


        }
    }

    ifPublicUrlConnectToRoomDirectly = () => {
        
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('room')) {

            try {

                var paramValue = urlParams.get('room');
                paramValue = atob(paramValue);
                console.log(paramValue);
                if(paramValue) { // if param is valid
                    var roomConfig = paramValue.split('_roomid_');
                    console.log(roomConfig);
                    $('#roomOptionSelect').val(2).trigger('change');
                    $('#roomName').val(roomConfig[1]);
                    $('#createRoomBtn').trigger('click');
                    
                    $('#showRoomDynamicName').html( "Room Name: <strong>" + roomConfig[0] + "</strong>" ).css('display', 'block');

                }
                
            } catch(e) {
                alert("Room id is not valid.");
            }

        }


    }

    // copyToClipBoard = (text, elem, elemId) => {
    //     var input = document.createElement("input");
    //     input.setAttribute('type', 'text');
    //     input.setAttribute('id', 'clipInput_' + elemId);
    //     input.setAttribute('value', text);
    //     elem.append(input);

    //     var copyText = document.getElementById('clipInput_' + elemId);
    //     copyText.select();
    //     copyText.setSelectionRange(0, 99999);
    //     document.execCommand("copy");
    //     $('#clipInput_' + elemId).remove();

    //     $('.iottooltiptext').each(function () {
    //         $(this).text($(this).parent().attr("iotid"));
    //     })

    //     var copyBtn = $('#btnCopyIotId' + elemId);
    //     copyBtn.find('.iottooltiptext').text('Copied.');

    // }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                    
                    <a className="navbar-brand" href="#"><img height="50" src={Logo}/></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse">
                    </div>

                    <div className="collapse navbar-collapse">
                        <button className="btn btn-sm btn-light"  style={{display:'none',marginRight:"10px"}} id="showRoomDynamicName"></button>
                        <button className="btn btn-sm btn-warning"  style={{display:'none',marginRight:"10px"}} id="showRoomDynamicId"></button>
                        <button className="btn btn-sm btn-warning"  style={{display:'none',marginRight:"10px"}} id="showRoomId"></button>
                    </div>

                    </div>
                </nav>

                <div className="container-fluid" id="usernameMain">
                    <div className="row justify-content-md-center">
                        <div className="col-md-6">
                            
                            <div className="row roomSelectionMainBox">
                                <div className="col-4 d-grid">
                                    <select id="roomOptionSelect">
                                        <option value="1">Create new room</option>
                                        <option value="2">Join existing room</option>
                                    </select>
                                </div>

                                <div className="col-4 d-grid">
                                    <div className="form-floating enterRoomName">
                                        <input type="text" className="form-control" id="roomName" placeholder="Enter room name"/>
                                        <label id="room_label">Enter room name</label>
                                    </div>
                                </div>
                            
                                <div className="col-3 d-grid">
                                    <button type="button" className="btn btn-primary btn-lg" id="createRoomBtn">Create</button>
                                </div>
                            </div>

                            <div className="row registrationUserForm" style={{display: this.state.showDisplayname === false ? "none" : "block"}}>
                                <div className="col-9 d-grid">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="userName" placeholder="Enter username"/>
                                        <label>Enter your display name</label>
                                    </div>
                                </div>
                            
                                <div className="col-3 d-grid">
                                    <button type="button" className="btn btn-primary btn-lg" id="enterToRoom">Enter</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="container-fluid" id="videosMain">
                    <div className="row" id="videos">
                        
                    </div>
                </div>

                <div className="container" id="room" style={{display: this.state.showRoom === false ? "none" : "block"}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Screen Capture <span className="label label-info" id="title"></span> <span className="label label-success" id="session"></span></h3>
                                </div>
                                <div className="panel-body" id="screencapture"></div>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="card text-white bg-dark mb-3 localVideoContainer" style={{width: "15rem", height: "11.3rem", display: "none"}}>
                    <div className="card-header">
                        <h4 style={{fontSize: "14px", fontWeight: "normal", marginBottom: "0", display: "inline-block"}}><span id="publisher"></span><span className="badge rounded-pill bg-light text-dark" style={{marginLeft: "10px"}}>My video</span></h4>

                        <div className="dropdown d-inline">
                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="bitrateset" data-bs-toggle="dropdown" aria-expanded="false">
                            Bandwidth<span className="caret"></span>
                            </button>
                            <ul id="bitrate" className="dropdown-menu" aria-labelledby="bitrateset">
                                <li><a id="0">No limit</a></li>
                                <li><a id="128">Cap to 128kbit</a></li>
                                <li><a id="256">Cap to 256kbit</a></li>
                                <li><a id="512">Cap to 512kbit</a></li>
                                <li><a id="1024">Cap to 1mbit</a></li>
                                <li><a id="1500">Cap to 1.5mbit</a></li>
                                {/* <li><a href="javascript:void(0)" id="2000">Cap to 2mbit</a></li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="card-body" id="videolocal">
                    </div>
                </div>
            </div>
        );
    }
};

export default App;