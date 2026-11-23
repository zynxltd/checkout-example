using System;
using System.Collections.Generic;
using System.Text;

namespace TheLiskovSubstitutionPrinciple.ModulesWrongApproach
{
    //LD STEP5
    public class SquareW : RectangleW
    {
        public override int Height
        {
            get => base.Height;
            set {  base.Height = value;
                   base.Width = value;
            }
        }

        public override int Width
        {
            get => base.Width;
            set
            {
                base.Width = value;
                base.Height = value;
            }
        }
    }
}