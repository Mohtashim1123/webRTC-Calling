// class definition for intrfaxeRtc
var intrfaxeRtc = function() {

    var intrfaxe = null;
    var server = "wss://signalkhi.codelabs.inc:8989/intrfaxe"; // This is intrfaxe server base url
    var http_server = "https://signalkhi.codelabs.inc:8089/intrfaxe"; // This is intrfaxe server base url
  
    var opaqueId = null;
    var sfutest = null;
    var mystream = null;
    var myusername = null;
    var feeds = [];
    var bitrateTimer = [];

    var myroom = 1234; // Demo room

    if (getQueryStringValue("room") !== "")
        myroom = parseInt(getQueryStringValue("room"));


    var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
    var doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");
    var subscriber_mode = (getQueryStringValue("subscriber-mode") === "yes" || getQueryStringValue("subscriber-mode") === "true");


    // This function will be used to connect/join the room. 
    var connect = function(options) {

        // example Params
        // var params = {
        //     room : "1234",
        //     username : "haseebPatel",
        //     sessionId : ""
        // }

        var params = options;

        console.log(params)

        if (params && params.room && params.room.length) {
            myroom = parseInt(params.room);
        } else {
            console.log("room id is required in params for intrfaxeRtc");
            return;
        }

        if (params && params.username && params.username.length) {
            myusername = params.username;
        } else {
            console.log("username is required in params for intrfaxeRtc");
            return;
        }

        // Room id/name
        opaqueId = "videoroomtest-" + Intrfaxe.randomString(12);

        Intrfaxe.init({
            debug: "all",
            callback: function() {
                console.log('intrfaxe initialized here');

                if (!Intrfaxe.isWebrtcSupported()) {
                    $.notify("Web Rtc is not supported.", {
                        globalPosition: 'top center',
                        className: 'error'
                    });
                    return;
                }

                // Create session
                intrfaxe = new Intrfaxe({
                    server: server,
                    success: function() {
                        // Attach to VideoRoom plugin
                        intrfaxe.attach({
                            plugin: "janus.plugin.videoroom",
                            opaqueId: opaqueId,
                            success: function(pluginHandle) {
                                sfutest = pluginHandle;
                                Intrfaxe.log("Plugin attached! (id=" + sfutest.getId() + ")");

                                // Prepare the username registration
                                // $('#enterToRoom').click(registerUsername);
                                // $('#userName').focus();

                                // check if we need to create a new room or join existing ?
                                if (params.isCreateRoom) {

                                    // ws = Intrfaxe.newWebSocket(server, 'janus-protocol');

                                    // var _message = {
                                    //     "request": "create",
                                    //     "decription": params.room,
                                    //     "bitrate": 512000
                                    // }

                                    // var request = { "janus": "message", "body": _message, "transaction": "3292771910343554" };
                                    // request["session_id"] = sfutest.getSessionId();
                                    // request["handle_id"] = sfutest.getId();
                                    // console.log(request);

                                    // ws.send(JSON.stringify(request));

                                    // if(ws) {
                                    // }
									
									var data = {
										
										"RoomName": params.room
									};
									
									$.ajax({
									  type: "POST",
									  headers: {
											AccessKey: '42c5afee94584002a609d52e146aa2f6',
										  
										},
									  url: 'https://cms.intrfaxe.com/api/Rooms/CreateRoom',
									  data: data,
									   success: function(json) {
                                        debugger
											if(json.response.responseCode == 0){
												  myroom = json.result.RoomSID;
													var register = {
														request: "join",
														room:parseInt(myroom),
														ptype: "publisher",
														display: myusername
													};
                                            sfutest.send({ message: register });
											}
											else{
												alert(json.response.responseMessage);
											}

										}
									  
									});
									// Intrfaxe.httpAPICall('https://projects.codelabs.inc/webrtc/api/rooms/CreateRoom', {
                                        // verb: 'POST',
                                        // // withCredentials: withCredentials,
                                        // body: {
                                            // "intrfaxe": "message",
                                            // "transaction": "3292771910343554",
                                            // "body": {
                                                // "request": "create",
                                                // "decription": params.room,
                                                // "room": Math.floor(Math.random() * 90000) + 10000,
                                                // "publishers": 100,
                                                // "bitrate": 512000,
                                                // "record": true
                                            // }
                                        // },
                                        // success: function(json) {
                                            // // console.log(json);

                                            // myroom = json.plugindata.data.room;
                                            // var register = {
                                                // request: "join",
                                                // room: json.plugindata.data.room,
                                                // ptype: "publisher",
                                                // display: myusername
                                            // };
                                            // sfutest.send({ message: register });

                                        // },
                                        // error: function(textStatus, errorThrown) {
                                            // Intrfaxe.error(textStatus + ":", errorThrown); // FIXME
                                        // }
                                    // });

                                    // Intrfaxe.httpAPICall(http_server + "/" + sfutest.getSessionId() + "/" + sfutest.getId(), {
                                        // verb: 'POST',
                                        // // withCredentials: withCredentials,
                                        // body: {
                                            // "intrfaxe": "message",
                                            // "transaction": "3292771910343554",
                                            // "body": {
                                                // "request": "create",
                                                // "decription": params.room,
                                                // "room": Math.floor(Math.random() * 90000) + 10000,
                                                // "publishers": 100,
                                                // "bitrate": 512000,
                                                // "record": true
                                            // }
                                        // },
                                        // success: function(json) {
                                            // // console.log(json);

                                            // myroom = json.plugindata.data.room;
                                            // var register = {
                                                // request: "join",
                                                // room: json.plugindata.data.room,
                                                // ptype: "publisher",
                                                // display: myusername
                                            // };
                                            // sfutest.send({ message: register });

                                        // },
                                        // error: function(textStatus, errorThrown) {
                                            // Intrfaxe.error(textStatus + ":", errorThrown); // FIXME
                                        // }
                                    // });

                                    // $.post(server + '/' + sfutest.getSessionId() + '/' + sfutest.getId(), , function(data) {
                                    //     console.log(data)
                                    // })


                                } else {

                                    var register = {
                                        request: "join",
                                        room: myroom,
                                        ptype: "publisher",
                                        display: myusername
                                    };
                                    sfutest.send({ message: register });

                                }


                            },
                            error: function(error) {
                                Intrfaxe.error("  -- Error attaching plugin...", error);
                                alert("Error attaching plugin... " + error);
                            },
                            consentDialog: function(on) {
                                Intrfaxe.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                                if (on) {
                                    // Darken screen and show hint
                                    $.blockUI({
                                        message: 'Allow access',
                                        css: {
                                            border: 'none',
                                            padding: '15px',
                                            backgroundColor: 'transparent',
                                            color: '#aaa',
                                            top: '10px',
                                            left: (navigator.mozGetUserMedia ? '-100px' : '300px')
                                        }
                                    });
                                } else {
                                    // Restore screen
                                    $.unblockUI();
                                }
                            },
                            iceState: function(state) {
                                Intrfaxe.log("ICE state changed to " + state);
                            },
                            mediaState: function(medium, on) {
                                Intrfaxe.log("Intrfaxe " + (on ? "started" : "stopped") + " receiving our " + medium);
                            },
                            webrtcState: function(on) {
                                Intrfaxe.log("Intrfaxe says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                                $("#videolocal").unblock();
                                if (!on)
                                    return;

                                // This controls allows us to override the global room bitrate cap
                                // $('#bitrate').parent().parent().removeClass('hide').show();
                                $('#bitrate a').click(function() {
                                    var id = $(this).attr("id");
                                    var bitrate = parseInt(id) * 1000;
                                    if (bitrate === 0) {
                                        console.log("Not limiting bandwidth via REMB");
                                        Intrfaxe.log("Not limiting bandwidth via REMB");
                                    } else {
                                        console.log("Capping bandwidth to " + bitrate + " via REMB");
                                        Intrfaxe.log("Capping bandwidth to " + bitrate + " via REMB");
                                    }
                                    $('#bitrateset').html($(this).html() + '<span class="caret"></span>').parent().removeClass('open');
                                    sfutest.send({ message: { request: "configure", bitrate: bitrate } });
                                    return false;
                                });
                            },
                            onmessage: function(msg, jsep) {
                                Intrfaxe.debug(" ::: Got a message (publisher) :::", msg);
                                var event = msg["videoroom"];
                                Intrfaxe.debug("Event: " + event);
                                if (event) {
                                    if (event === "joined") {
                                        // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                                        myid = msg["id"];
                                        mypvtid = msg["private_id"];
                                        Intrfaxe.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                                        // show the dynamic room id generated
                                        $('#showRoomId').attr('roomname', params.room).attr('roomid', msg["room"]).html("Click to copy room id: <strong>" + msg["room"] + "</strong>").css('display', 'block');
                                        $('#showscreenshareRoomDynamicId').html("Screen Share").css('display', 'block');
                                        $('#showRoomDynamicId').attr('roomname', (params.roomNameOnly ? params.roomNameOnly : params.room)).attr('roomid', msg["room"]).html("Click to copy the Share URL").css('display', 'block');
                                        // $('#showRoomId').attr('roomname', (params.roomNameOnly ? params.roomNameOnly : params.room)).attr('roomid', msg["room"]).html("Click to copy the Room id").css('display', 'block');
                                        // if(params.roomNameOnly) {
                                        $('#showRoomDynamicName').html("Room Name: <strong>" + (params.roomNameOnly ? params.roomNameOnly : params.room) + "</strong>").css('display', 'block');
                                        // }

                                        if (subscriber_mode) {
                                            $('#usernameMain').hide();
                                            $('#videos').removeClass('hide').show();
                                        } else {
                                            publishOwnFeed(true);
                                        }
                                        // Any new feed to attach to?
                                        if (msg["publishers"]) {
                                            var list = msg["publishers"];
                                            Intrfaxe.debug("Got a list of available publishers/feeds:", list);
                                            for (var f in list) {
                                                var id = list[f]["id"];
                                                var display = list[f]["display"];
                                                var audio = list[f]["audio_codec"];
                                                var video = list[f]["video_codec"];
                                                Intrfaxe.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                                                newRemoteFeed(id, display, audio, video);
                                            }
                                        }
                                    } else if (event === "destroyed") {
                                        // The room has been destroyed
                                        Intrfaxe.warn("The room has been destroyed!");
                                        bootbox.alert("The room has been destroyed", function() {
                                            window.location.reload();
                                        });
                                    } else if (event === "event") {
                                        // Any new feed to attach to?
                                        if (msg["publishers"]) {
                                            var list = msg["publishers"];
                                            Intrfaxe.debug("Got a list of available publishers/feeds:", list);
                                            for (var f in list) {
                                                var id = list[f]["id"];
                                                var display = list[f]["display"];
                                                var audio = list[f]["audio_codec"];
                                                var video = list[f]["video_codec"];
                                                Intrfaxe.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                                                newRemoteFeed(id, display, audio, video);
                                            }
                                        } else if (msg["leaving"]) {
                                            // One of the publishers has gone away?
                                            var leaving = msg["leaving"];
                                            Intrfaxe.log("Publisher left - LEAVING: " + leaving);
                                            console.log(feeds)
                                            var remoteFeed = null;
                                            for (var i = 1; i < 19; i++) {
                                                if (feeds[i] && feeds[i].rfid == leaving) {
                                                    remoteFeed = feeds[i];
                                                    break;
                                                }
                                            }
                                            if (remoteFeed != null) {
                                                Intrfaxe.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
                                                Intrfaxe.log("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
                                                $('#remote' + remoteFeed.rfindex).empty().hide();
                                                $('#videoremote' + remoteFeed.rfindex).empty();
                                                feeds[remoteFeed.rfindex] = null;
                                                remoteFeed.detach();
                                            }
                                        } else if (msg["unpublished"]) {
                                            // One of the publishers has unpublished?
                                            var unpublished = msg["unpublished"];
                                            Intrfaxe.log("Publisher left - UNPUBLISHED: " + unpublished);
                                            if (unpublished === 'ok') {
                                                // That's us
                                                sfutest.hangup();
                                                return;
                                            }
                                            var remoteFeed = null;
                                            for (var i = 1; i < 19; i++) {
                                                if (feeds[i] && feeds[i].rfid == unpublished) {
                                                    remoteFeed = feeds[i];
                                                    break;
                                                }
                                            }
                                            if (remoteFeed != null) {
                                                Intrfaxe.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
                                                $('#remote' + remoteFeed.rfindex).empty().hide();
                                                $('#videoremote' + remoteFeed.rfindex).empty();
                                                feeds[remoteFeed.rfindex] = null;
                                                remoteFeed.detach();
                                            }
                                        } else if (msg["error"]) {
                                            if (msg["error_code"] === 426) {
                                                // This is a "no such room" error: give a more meaningful description
                                                bootbox.alert(
                                                    "<p>Apparently room <code>" + myroom + "</code> (the one this demo uses as a test room) " +
                                                    "does not exist...</p><p>Do you have an updated <code>intrfaxe.plugin.videoroom.jcfg</code> " +
                                                    "configuration file? If not, make sure you copy the details of room <code>" + myroom + "</code> " +
                                                    "from that sample in your current configuration file, then restart Intrfaxe and try again."
                                                );
                                            } else {
                                                bootbox.alert(msg["error"]);
                                            }
                                        }
                                    }
                                }
                                if (jsep) {
                                    Intrfaxe.debug("Handling SDP as well...", jsep);
                                    sfutest.handleRemoteJsep({ jsep: jsep });
                                    // Check if any of the media we wanted to publish has
                                    // been rejected (e.g., wrong or unsupported codec)
                                    var audio = msg["audio_codec"];
                                    if (mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
                                        // Audio has been rejected
                                        toastr.warning("Our audio stream has been rejected, viewers won't hear us");
                                    }
                                    var video = msg["video_codec"];
                                    if (mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
                                        // Video has been rejected
                                        toastr.warning("Our video stream has been rejected, viewers won't see us");
                                        // Hide the webcam video
                                        $('#myvideo').hide();
                                        $('#videolocal').append(
                                            '<div class="no-video-container">' +
                                            '<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>' +
                                            '<span class="no-video-text" style="font-size: 16px;">Video rejected, no webcam</span>' +
                                            '</div>');
                                    }
                                }
                            },
                            onlocalstream: function(stream) {
                                Intrfaxe.debug(" ::: Got a local stream :::", stream);
                                mystream = stream;
                                $('#stopButtonHeader').css('display', 'block');
                                $('#usernameMain').hide();
                                $('#videos').removeClass('hide').show();
                                $('.localVideoContainer').css('display', '');
                                if ($('#myvideo').length === 0) {
                                    $('#videolocal').append('<video class="centered" id="myvideo" autoplay playsinline muted="muted"/>');
                                    // Add a 'mute' button
                                    $('#videolocal').append('<button class="btn btn-danger btn-sm" id="mute" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;">Mute</button>');
                                    $('#mute').click(toggleMute);
                                    // Add an 'unpublish' button
                                    $('#videolocal').append('<button class="btn btn-warning btn-sm" id="unpublish" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;">Unpublish</button>');
                                    $('#unpublish').click(unpublishOwnFeed);
                                }
                                $('#publisher').removeClass('hide').html(myusername).show();
                                Intrfaxe.attachMediaStream($('#myvideo').get(0), stream);
                                $("#myvideo").get(0).muted = "muted";
                                if (sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                                    sfutest.webrtcStuff.pc.iceConnectionState !== "connected") {
                                    $("#videolocal").block({
                                        message: '<b style="font-size: 13px;">Publishing...</b>',
                                        css: {
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            color: 'white'
                                        }
                                    });
                                }
                                var videoTracks = stream.getVideoTracks();
                                if (!videoTracks || videoTracks.length === 0) {
                                    // No webcam
                                    $('#myvideo').hide();
                                    if ($('#videolocal .no-video-container').length === 0) {
                                        $('#videolocal').append(
                                            '<div class="no-video-container">' +
                                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                            '<span class="no-video-text">No webcam available</span>' +
                                            '</div>');
                                    }
                                } else {
                                    $('#videolocal .no-video-container').remove();
                                    $('#myvideo').removeClass('hide').show();
                                }
                            },
                            onremotestream: function(stream) {
                                // The publisher stream is sendonly, we don't expect anything here
                            },
                            oncleanup: function() {
                                Intrfaxe.log(" ::: Got a cleanup notification: we are unpublished now :::");
                                mystream = null;
                                $('#videolocal').html('<button id="publish" class="btn btn-primary">Publish</button>');
                                $('#publish').click(function() { publishOwnFeed(true); });
                                $("#videolocal").unblock();
                                // $('#bitrate').parent().parent().addClass('hide');
                                $('#bitrate a').unbind('click');

                            }
                        });
                    },
                    error: function(error) {
                        Intrfaxe.error(error);
                        $.notify(error + ". Please try to reload.", {
                            globalPosition: 'top center',
                            className: 'error'
                        });
                    },
                    destroyed: function() {
                        window.location.reload();
                    }
                });


            }
        })

        // return the values that is required in order to populate further
        // return {
        //     localStream : mystream,
        // }

        // })
    };


    // This function will publish own feed
    var publishOwnFeed = function(useAudio) {
        // Publish our stream
        $('#publish').attr('disabled', true).unbind('click').hide();
        sfutest.createOffer({
            // Add data:true here if you want to publish datachannels as well
            media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true, video: "hires" }, // Publishers are sendonly
            // If you want to test simulcasting (Chrome and Firefox only), then
            // pass a ?simulcast=true when opening this demo page: it will turn
            // the following 'simulcast' property to pass to intrfaxe.js to true
            simulcast: doSimulcast,
            simulcast2: doSimulcast2,
            success: function(jsep) {
                Intrfaxe.debug("Got publisher SDP!", jsep);
                var publish = { request: "configure", audio: useAudio, video: true };
                // You can force a specific codec to use when publishing by using the
                // audiocodec and videocodec properties, for instance:
                // 		publish["audiocodec"] = "opus"
                // to force Opus as the audio codec to use, or:
                // 		publish["videocodec"] = "vp9"
                // to force VP9 as the videocodec to use. In both case, though, forcing
                // a codec will only work if: (1) the codec is actually in the SDP (and
                // so the browser supports it), and (2) the codec is in the list of
                // allowed codecs in a room. With respect to the point (2) above,
                // refer to the text in intrfaxe.plugin.videoroom.jcfg for more details
                sfutest.send({ message: publish, jsep: jsep });
            },
            error: function(error) {
                Intrfaxe.error("WebRTC error:", error);
                if (useAudio) {
                    publishOwnFeed(false);
                } else {
                    alert("WebRTC error... " + error.message);
                    $('#publish').removeAttr('disabled').click(function() { publishOwnFeed(true); });
                }
            }
        });
    }

    var toggleMute = function() {
        var muted = sfutest.isAudioMuted();
        Intrfaxe.log((muted ? "Unmuting" : "Muting") + " local stream...");
        if (muted)
            sfutest.unmuteAudio();
        else
            sfutest.muteAudio();
        muted = sfutest.isAudioMuted();
        $('#mute').html(muted ? "Unmute" : "Mute");
    }

    var unpublishOwnFeed = function() {
        // Unpublish our stream
        $('#unpublish').attr('disabled', true).unbind('click');
        var unpublish = { request: "unpublish" };
        sfutest.send({ message: unpublish });
    }

    var newRemoteFeed = function(id, display, audio, video) {
        // A new feed has been published, create a new plugin handle and attach to it as a subscriber
        var remoteFeed = null;
        intrfaxe.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: opaqueId,
            success: function(pluginHandle) {
                remoteFeed = pluginHandle;
                remoteFeed.simulcastStarted = false;
                Intrfaxe.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
                Intrfaxe.log("  -- This is a subscriber");
                // We wait for the plugin to send us an offer
                var subscribe = {
                    request: "join",
                    room: myroom,
                    ptype: "subscriber",
                    feed: id,
                    private_id: mypvtid
                };
                // In case you don't want to receive audio, video or data, even if the
                // publisher is sending them, set the 'offer_audio', 'offer_video' or
                // 'offer_data' properties to false (they're true by default), e.g.:
                // 		subscribe["offer_video"] = false;
                // For example, if the publisher is VP8 and this is Safari, let's avoid video
                if (Intrfaxe.webRTCAdapter.browserDetails.browser === "safari" &&
                    (video === "vp9" || (video === "vp8" && !Intrfaxe.safariVp8))) {
                    if (video)
                        video = video.toUpperCase()
                    toastr.warning("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
                    subscribe["offer_video"] = false;
                }
                remoteFeed.videoCodec = video;
                remoteFeed.send({ message: subscribe });
            },
            error: function(error) {
                Intrfaxe.error("  -- Error attaching plugin...", error);
                bootbox.alert("Error attaching plugin... " + error);
            },
            onmessage: function(msg, jsep) {
                Intrfaxe.debug(" ::: Got a message (subscriber) :::", msg);
                console.log(msg)
                var event = msg["videoroom"];
                Intrfaxe.debug("Event: " + event);
                if (msg["error"]) {
                    bootbox.alert(msg["error"]);
                } else if (event) {
                    if (event === "attached") {
                        // Subscriber created and attached
                        for (var i = 1; i < 19; i++) {
                            if (!feeds[i]) {
                                feeds[i] = remoteFeed;
                                remoteFeed.rfindex = i;
                                break;
                            }
                        }
                        remoteFeed.rfid = msg["id"];
                        remoteFeed.rfdisplay = msg["display"];
                        if (!remoteFeed.spinner) {
                            var target = document.getElementById('videoremote' + remoteFeed.rfindex);
                            remoteFeed.spinner = new Spinner({ top: 100 }).spin(target);
                        } else {
                            remoteFeed.spinner.spin();
                        }
                        Intrfaxe.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
                        console.log(feeds)
                        $('#remote' + remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay).show();
                    } else if (event === "event") {
                        // Check if we got a simulcast-related event from this publisher
                        var substream = msg["substream"];
                        var temporal = msg["temporal"];
                        if ((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                            if (!remoteFeed.simulcastStarted) {
                                remoteFeed.simulcastStarted = true;
                                // Add some new buttons
                                addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === "vp8" || remoteFeed.videoCodec === "h264");
                            }
                            // We just received notice that there's been a switch, update the buttons
                            updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
                        }
                    } else {
                        // What has just happened?
                    }
                }
                if (jsep) {
                    Intrfaxe.debug("Handling SDP as well...", jsep);
                    // Answer and attach
                    remoteFeed.createAnswer({
                        jsep: jsep,
                        // Add data:true here if you want to subscribe to datachannels as well
                        // (obviously only works if the publisher offered them in the first place)
                        media: { audioSend: false, videoSend: false, video: "hires" }, // We want recvonly audio/video
                        success: function(jsep) {
                            Intrfaxe.debug("Got SDP!", jsep);
                            var body = { request: "start", room: myroom };
                            remoteFeed.send({ message: body, jsep: jsep });
                        },
                        error: function(error) {
                            Intrfaxe.error("WebRTC error:", error);
                            bootbox.alert("WebRTC error... " + error.message);
                        }
                    });
                }
            },
            iceState: function(state) {
                Intrfaxe.log("ICE state of this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") changed to " + state);
            },
            webrtcState: function(on) {
                Intrfaxe.log("Intrfaxe says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
            },
            onlocalstream: function(stream) {
                // The subscriber stream is recvonly, we don't expect anything here
            },
            onremotestream: function(stream) {
                Intrfaxe.debug("Remote feed #" + remoteFeed.rfindex + ", stream:", stream);
                console.log(`Remote feed # ${remoteFeed.rfindex}`);
                // console.log(stream)
                // console.log(remoteFeed)
                var addButtons = false;
                if ($('#remotevideo' + remoteFeed.rfindex).length === 0) {
                    addButtons = true;

                    if ($('#videoremote' + remoteFeed.rfindex).length === 0) {
                        $('#videos').append(`
                                <div class="col-xs-2 col-sm-2 col-md-2 participantContainer" feedId="` + remoteFeed.rfid + `" id="videoremote` + remoteFeed.rfindex + `"></div>
                            `)
                    }

                    // No remote video yet
                    $('#videoremote' + remoteFeed.rfindex).append('<video class="rounded centered" id="waitingvideo' + remoteFeed.rfindex + '" width="100%" height="100%" />');
                    $('#videoremote' + remoteFeed.rfindex).append('<video class="rounded centered relative hide" id="remotevideo' + remoteFeed.rfindex + '" width="100%" height="100%" autoplay playsinline/>');
                    $('#videoremote' + remoteFeed.rfindex).append(
                        '<span class="label bottomstrip">' + remoteFeed.rfdisplay +
                        '&nbsp;&nbsp;<span class="label hide" id="curres' + remoteFeed.rfindex + '"></span>&nbsp;&nbsp;' +
                        '<span class="label hide" id="curbitrate' + remoteFeed.rfindex + '"></span>' +
                        '</span>'
                    );
                    // Show the video, hide the spinner and show the resolution when we get a playing event
                    $("#remotevideo" + remoteFeed.rfindex).bind("playing", function() {
                        if (remoteFeed.spinner)
                            remoteFeed.spinner.stop();
                        remoteFeed.spinner = null;
                        $('#waitingvideo' + remoteFeed.rfindex).remove();
                        if (this.videoWidth)
                            $('#remotevideo' + remoteFeed.rfindex).removeClass('hide').show();
                        var width = this.videoWidth;
                        var height = this.videoHeight;
                        $('#curres' + remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay + ' <sup>(' + width + 'x' + height + ')</sup>').show();
                        if (Intrfaxe.webRTCAdapter.browserDetails.browser === "firefox") {
                            // Firefox Stable has a bug: width and height are not immediately available after a playing
                            setTimeout(function() {
                                var width = $("#remotevideo" + remoteFeed.rfindex).get(0).videoWidth;
                                var height = $("#remotevideo" + remoteFeed.rfindex).get(0).videoHeight;
                                $('#curres' + remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay + ' <sup>' + width + 'x' + height + '</sup>').show();
                            }, 2000);
                        }
                    });
                }
                Intrfaxe.attachMediaStream($('#remotevideo' + remoteFeed.rfindex).get(0), stream);
                var videoTracks = stream.getVideoTracks();
                if (!videoTracks || videoTracks.length === 0) {
                    // No remote video
                    $('#remotevideo' + remoteFeed.rfindex).hide();
                    if ($('#videoremote' + remoteFeed.rfindex + ' .no-video-container').length === 0) {
                        $('#videoremote' + remoteFeed.rfindex).append(
                            '<div class="no-video-container">' +
                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                            '<span class="no-video-text">No remote video available</span>' +
                            '</div>');
                    }
                } else {
                    $('#videoremote' + remoteFeed.rfindex + ' .no-video-container').remove();
                    $('#remotevideo' + remoteFeed.rfindex).removeClass('hide').show();
                }
                if (!addButtons)
                    return;
                if (Intrfaxe.webRTCAdapter.browserDetails.browser === "chrome" || Intrfaxe.webRTCAdapter.browserDetails.browser === "firefox" ||
                    Intrfaxe.webRTCAdapter.browserDetails.browser === "safari") {
                    $('#curbitrate' + remoteFeed.rfindex).removeClass('hide').show();
                    bitrateTimer[remoteFeed.rfindex] = setInterval(function() {
                        // Display updated bitrate, if supported
                        var bitrate = remoteFeed.getBitrate();
                        $('#curbitrate' + remoteFeed.rfindex).text(bitrate);
                        // Check if the resolution changed too
                        var width = $("#remotevideo" + remoteFeed.rfindex).get(0).videoWidth;
                        var height = $("#remotevideo" + remoteFeed.rfindex).get(0).videoHeight;
                        if (width > 0 && height > 0)
                            $('#curres' + remoteFeed.rfindex).removeClass('hide').text(width + 'x' + height).show();
                    }, 1000);
                }
            },
            oncleanup: function() {
                Intrfaxe.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
                if (remoteFeed.spinner)
                    remoteFeed.spinner.stop();
                remoteFeed.spinner = null;
                $('#remotevideo' + remoteFeed.rfindex).remove();
                $('#waitingvideo' + remoteFeed.rfindex).remove();
                $('#novideo' + remoteFeed.rfindex).remove();
                $('#curbitrate' + remoteFeed.rfindex).remove();
                $('#curres' + remoteFeed.rfindex).remove();
                if (bitrateTimer[remoteFeed.rfindex])
                    clearInterval(bitrateTimer[remoteFeed.rfindex]);
                bitrateTimer[remoteFeed.rfindex] = null;
                remoteFeed.simulcastStarted = false;
                $('#simulcast' + remoteFeed.rfindex).remove();
            }
        });
    }


    return {
        init: function() {
            console.log('initialized the intrfaxeRtc')
        },
        connect: async function(options) {
            const result = await connect(options);
            return result;
        },
        stop: function() {
            intrfaxe.destroy();
        },
        getLocalStream: function() {
            return mystream;
        }
    }

}()



function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


// When user clicks on Enter button for entering into the room.
// function registerUsername() {
// 	if($('#userName').length === 0) {
// 		// Create fields to register
// 		$('#enterToRoom').click(registerUsername);
// 		$('#userName').focus();
// 	} else {
// 		// Try a registration
// 		var username = $('#userName').val();
// 		if(username === "") {
// 			return;
// 		}
// 		if(/[^a-zA-Z0-9]/.test(username)) {
// 			return;
// 		}
// 		var register = {
// 			request: "join",
// 			room: myroom,
// 			ptype: "publisher",
// 			display: username
// 		};
// 		myusername = username;
// 		sfutest.send({ message: register });
// 	}
// }