let nrtoSucess = 5;
let nrtoFail = 2; // !!!

const builder = new BehaviorTreeBuilder();
    this.tree = builder  
      //.Parallel("root", nrtoSucess, nrtoFail)
      //maybe a .Sequence("root") (prob not)
      // maybe a selector?
      .Selector("Root")
        .Selector("FightorHeal")
            .Condition("currHealth", t => checkHealth()) //stop if return false

            .Do("heal", t => Heal()) //stop if success
        .end()

        .Selector("Attack")
            .Condition("Weakness", t => checkWeakness()) //stop if return false

            .Do("elementalAttack" t=> elementalAttack()) //stop if success
        .end()
        // maybe need another condition to work?
        .Do("regularAttack" t => regularAttack()) //stop if success
      .end()
    .end()
    .build();

    Selector ends for succsess
    sequence end for fail


    function checkHealth() {
        if (hp < something && hasHealthpack)
            return true;
        else
            return false;
    }

    function Heal() {
        //Use healthpack
        return success
    }

    function checkWeakness() {
        if(Enemys element == weak)
            return true
        else
            return false
    }

    function elementalAttack() {
        //use Elemntal attack
        return success
    }

    function regularAttack() {
        //Use regular attack
        return success
    }