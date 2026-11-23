using System;
using System.Collections.Generic;
using System.Text;

namespace TheLiskovSubstitutionPrinciple.ModulesWrongApproach
{
    //LD STEP6
    public class AreaCalculatorW
    {
        public static int CalculateArea(RectangleW r)
        {
            return r.Height * r.Width;
        }

        public static int CalculateArea(SquareW s)
        {
            return s.Height * s.Height;
        }
    }
}

