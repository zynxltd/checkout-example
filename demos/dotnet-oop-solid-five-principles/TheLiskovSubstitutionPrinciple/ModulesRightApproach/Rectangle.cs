using System;
using System.Collections.Generic;
using System.Text;

namespace TheLiskovSubstitutionPrinciple.ModulesRightApproach
{
    //LD STEP9
    public class Rectangle : Shape
    {
        public int Height { get; set; }
        public int Width { get; set; }

        public override int Area()
        {
            return Height * Width;
        }
    }

}
