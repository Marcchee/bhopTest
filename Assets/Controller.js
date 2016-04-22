#pragma strict

/// This script moves the character controller forward 
/// and sideways based on the arrow keys.
/// It also jumps when pressing space.
/// Make sure to attach a character controller to the same game object.
/// It is recommended that you make only one call to Move or SimpleMove per frame.	

import UnityEngine.UI;

enum strafeEnum {LEFT, NONE, RIGHT}

var speed : float = 4.0;
var minspeed : float = 4.0;
var maxspeed : float = 16.0;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;
var UIText : GameObject;
var cam : GameObject;

private var moveDirection : Vector3 = Vector3.zero;
private var jumping = false;
private var strafe = strafeEnum.NONE;

function accelerate(addSpeed : float)
{
	speed += addSpeed;
	if (speed > maxspeed)
	{
		speed = maxspeed;
	}
}

function angleDir(fwd : Vector3, targetDir : Vector3, up : Vector3) {
	var perp : Vector3 = Vector3.Cross(fwd, targetDir);
	var dir: float = Vector3.Dot(perp, up);

	if (dir > 0.0) {
		return 1.0;
	} else if (dir < 0.0) {
		return -1.0;
	} else {
		return 0.0;
	}
}

function turnEnough(moveDir : Vector3, lookDir : Vector3) {
	lookDir.y = 0;
    lookDir.Normalize();
    moveDir.y = 0;
    moveDir.Normalize();
	var angle = Vector3.Angle(moveDir, lookDir);
    var direction = angleDir(moveDir, lookDir, Vector3(0,1,0));

    if(angle > 15)
    {
    	return direction;
    }
}

function Start() {	
	
}

function Update() {
    var controller : CharacterController = GetComponent.<CharacterController>();
    var text : UI.Text = UIText.GetComponent("Text");
    text.text = speed.ToString();
    if (controller.isGrounded) {
    	jumping = false;
    	moveDirection = Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        moveDirection = transform.TransformDirection(moveDirection);
        moveDirection *= speed;
        if (Input.GetButton ("Jump")) {
            moveDirection.y = jumpSpeed;
            jumping = true;
            strafe = strafeEnum.NONE;
            if(Input.GetAxis("Vertical") > 0) // W is pressed
            {
            	accelerate(1.0);
            }
        }/* else { // not jumping
        	speed = minspeed;
        	moveDirection = Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        	moveDirection = transform.TransformDirection(moveDirection);
        }*/

    } else if (jumping) { // we're in the air
	    var turnValue = turnEnough(moveDirection, cam.transform.TransformDirection(Vector3.forward));
	    if(strafe == strafeEnum.NONE && turnValue > 0 && Input.GetAxis("Horizontal") > 0) // right
	    {
	    	accelerate(2.0);
	    	strafe = strafeEnum.RIGHT;
	    } else if (strafe == strafeEnum.NONE && turnValue < 0 && Input.GetAxis("Horizontal") < 0) // left
	    {
	    	accelerate(2.0);
	    	strafe = strafeEnum.LEFT;
	    }
    }
    // Apply Speed


    // Apply gravity
    moveDirection.y -= gravity * Time.deltaTime;
		
    // Move the controller
    controller.Move(moveDirection * Time.deltaTime);
}