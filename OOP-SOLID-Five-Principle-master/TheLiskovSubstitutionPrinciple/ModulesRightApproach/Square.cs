using System;
using System.Collections.Generic;
using System.Text;

namespace TheLiskovSubstitutionPrinciple.ModulesRightApproach
{
    //LD STEP8
    public class Square : Shape
    {
        public int SideLength;

        public override int Area()
        {
            return SideLength * SideLength;
        }
    }
}
