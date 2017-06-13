ATT.IoT.StarterKitPortal.StickMan = function () {

    var self = this;
    self._waveIntervalID = 0;
    self.wave = function () {
        $(".bottomArm.left").toggleClass("waving");
    };
    self.stopWaving = function () {
        clearInterval(self._waveIntervalID);
        self._waveIntervalID = 0;
    };

    self.stand = function () {

        self.stopWaving();
        //remove class - FALL
        $(".head").removeClass("headFall");
        $(".torso").removeClass("torsoFall");

        $(".arm.left.bodyAppendage").removeClass("armLeftFall");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftFall");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftFall");

        $(".arm.right.bodyAppendage").removeClass("armRightFall");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightFall");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightFall");

        $(".leg.left.bodyAppendage").removeClass("legLeftFall");
        $(".leg.right.bodyAppendage").removeClass("legRightFall");


        //remove class - LIE
        $(".head").removeClass("headLie");
        $(".torso").removeClass("torsoLie");

        $(".arm.left.bodyAppendage").removeClass("armLeftLie");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftLie");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftLie");

        $(".arm.right.bodyAppendage").removeClass("armRightLie");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightLie");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightLie");

        $(".leg.left.bodyAppendage").removeClass("legLeftLie");
        $(".leg.right.bodyAppendage").removeClass("legRightLie");





        //add class - STAND
        $(".head").addClass("headStand");
        $(".torso").addClass("torsoStand");

        $(".arm.left.bodyAppendage").addClass("armLeftStand");
        $(".topArm.left.bodyAppendage").addClass("topArmLeftStand");

        //not setting to help with wave after stand up
        //$(".bottomArm.left.bodyAppendage").addClass("bottomArmLeftStand");

        $(".arm.right.bodyAppendage").addClass("armRightStand");
        $(".topArm.right.bodyAppendage").addClass("topArmRightStand");
        $(".bottomArm.right.bodyAppendage").addClass("bottomArmRightStand");

        $(".leg.left.bodyAppendage").addClass("legLeftStand");
        $(".leg.right.bodyAppendage").addClass("legRightStand");


        self._waveIntervalID = setInterval(self.wave, 2000);
    };



    //fall - head
    self.fall = function () {

        //add class - FALL
        $(".head").addClass("headFall");
        $(".torso").addClass("torsoFall");

        $(".arm.left.bodyAppendage").addClass("armLeftFall");
        $(".topArm.left.bodyAppendage").addClass("topArmLeftFall");
        $(".bottomArm.left.bodyAppendage").addClass("bottomArmLeftFall");

        $(".arm.right.bodyAppendage").addClass("armRightFall");
        $(".topArm.right.bodyAppendage").addClass("topArmRightFall");
        $(".bottomArm.right.bodyAppendage").addClass("bottomArmRightFall");

        $(".leg.left.bodyAppendage").addClass("legLeftFall");
        $(".leg.right.bodyAppendage").addClass("legRightFall");




        //remove class - LIE
        $(".head").removeClass("headLie");
        $(".torso").removeClass("torsoLie");

        $(".arm.left.bodyAppendage").removeClass("armLeftLie");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftLie");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftLie");

        $(".arm.right.bodyAppendage").removeClass("armRightLie");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightLie");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightLie");

        $(".leg.left.bodyAppendage").removeClass("legLeftLie");
        $(".leg.right.bodyAppendage").removeClass("legRightLie");


        //remove class - STAND
        self.stopWaving();
        $(".head").removeClass("headStand");
        $(".torso").removeClass("torsoStand");

        $(".arm.left.bodyAppendage").removeClass("armLeftStand");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftStand");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftStand");

        $(".arm.right.bodyAppendage").removeClass("armRightStand");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightStand");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightStand");

        $(".leg.left.bodyAppendage").removeClass("legLeftStand");
        $(".leg.right.bodyAppendage").removeClass("legRightStand");
    };




    //fall - head
    self.lieDown = function () {

        //remove class - STAND
        self.stopWaving();
        $(".head").removeClass("headStand");
        $(".torso").removeClass("torsoStand");

        $(".arm.left.bodyAppendage").removeClass("armLeftStand");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftStand");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftStand");

        $(".arm.right.bodyAppendage").removeClass("armRightStand");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightStand");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightStand");

        $(".leg.left.bodyAppendage").removeClass("legLeftStand");
        $(".leg.right.bodyAppendage").removeClass("legRightStand");


        //remove class - FALL
        $(".head").removeClass("headFall");
        $(".torso").removeClass("torsoFall");

        $(".arm.left.bodyAppendage").removeClass("armLeftFall");
        $(".topArm.left.bodyAppendage").removeClass("topArmLeftFall");
        $(".bottomArm.left.bodyAppendage").removeClass("bottomArmLeftFall");

        $(".arm.right.bodyAppendage").removeClass("armRightFall");
        $(".topArm.right.bodyAppendage").removeClass("topArmRightFall");
        $(".bottomArm.right.bodyAppendage").removeClass("bottomArmRightFall");

        $(".leg.left.bodyAppendage").removeClass("legLeftFall");
        $(".leg.right.bodyAppendage").removeClass("legRightFall");


        //add class - LIE
        $(".head").addClass("headLie");
        $(".torso").addClass("torsoLie");

        $(".arm.left.bodyAppendage").addClass("armLeftLie");
        $(".topArm.left.bodyAppendage").addClass("topArmLeftLie");
        $(".bottomArm.left.bodyAppendage").addClass("bottomArmLeftLie");

        $(".arm.right.bodyAppendage").addClass("armRightLie");
        $(".topArm.right.bodyAppendage").addClass("topArmRightLie");
        $(".bottomArm.right.bodyAppendage").addClass("bottomArmRightLie");

        $(".leg.left.bodyAppendage").addClass("legLeftLie");
        $(".leg.right.bodyAppendage").addClass("legRightLie");
    };
};