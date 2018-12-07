behaviourTree = builder
        .Parallel("All", 20, 20)
            .Do("ComputeWaypointDist", t => ComputeWaypointDist())

			// Always try to go at at the speed limit.
            .Do("SpeedLimit", t => SpeedLimit())                
            .Sequence("Cornering")
                .Condition("IsApproachingCorner", 
                    t => IsApproachingCorner()
                )

				// Slow down vehicles that are approaching a corner.
                .Do("Cornering", t => ApplyCornering())              
            .End()

			// Always attempt to detect other vehicles.
            .Do("Detect", t => DetectOtherVehicles())           
            .Sequence("React to blockage")
                .Condition("Approaching Vehicle", 
                    t => IsApproachingVehicle()
                )
				
				// Always attempt to match speed with the vehicle in front.
                .Do("Match Speed", t => MatchSpeed())                     
            .End()
            .Selector("Stuff")
				
				// Slow down for give way or stop sign.
                .Sequence("Traffic Light")                                      
                    .Condition("IsApproaching", t => IsApproachingSignal())

					// Slow down for the stop sign.
                    .Do("ApproachStopSign", t => ApproachStopSign())            

					// Wait for complete stop.
                    .Do("WaitForSpeedZero", t => WhenSpeedIsZero())

					// Wait at stop sign until the way is clear.             
                    .Do("WaitForGreenSignal", t => WaitForGreenSignal())    
                    .Selector("NextWaypoint Or Recycle")
                        .Condition("SelectNextWaypoint", 
                            t => TargetNextWaypoint()
                        )

						// If selection of waypoint fails, recycle vehicle.
                        .Do("Recycle", t => RecycleVehicle()) 
                    .End()
                .End()
				
				// Slow down for give way or stop sign.
                .Sequence("Stop Sign")                                          
                    .Condition("IsApproaching", 
                        t => IsApproachingStopSign()
                    )

					// Slow down for the stop sign.
                    .Do("ApproachStopSign", t => ApproachStopSign())
        
					// Wait for complete stop.
                    .Do("WaitForSpeedZero", t => WhenSpeedIsZero())             
					
					// Wait at stop sign until the way is clear.
                    .Do("WaitForClearAwareness", 
                        t => WaitForClearAwarenessZone()
                    )    
                    .Selector("NextWaypoint Or Recycle")
                        .Condition("SelectNextWaypoint", 
                            t => TargetNextWaypoint()
                        )

						// If selection of waypoint fails, recycle vehicle.
                        .Do("Recycle", t => RecycleVehicle()) 
                    .End()
                .End()
                .Sequence("Follow path then recycle")
                    .Do("ApproachWaypoint", t => ApproachWaypoint())
                    .Selector("NextWaypoint Or Recycle")
                        .Condition("SelectNextWaypoint", 
                            t => TargetNextWaypoint()
                        )

						// If selection of waypoint fails, recycle vehicle.
                        .Do("Recycle", t => RecycleVehicle()) 
                    .End()
                .End()
            .End()

			// Drive the vehicle based on desired speed and direction.
            .Do("Drive", t => DriveVehicle())           
        .End()
    .End()
    .Build();