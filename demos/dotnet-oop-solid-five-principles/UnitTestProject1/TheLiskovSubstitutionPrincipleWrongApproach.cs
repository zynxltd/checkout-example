using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using TheLiskovSubstitutionPrinciple.ModulesWrongApproach;

namespace UnitTestProject1
{
    //LD STEP7
    //LD UNIT TEST CLASS DESCRIPTION: calculated area Should return: 
    [TestClass]
    public class TheLiskovSubstitutionPrincipleWrongApproach
    {

        private RectangleW _rectangle;

        [TestInitialize]
        public void Setup()
        {
            _rectangle = new RectangleW();
        }
           
        [TestMethod]
        public void SixFor2X3Rectangle()
        {
            var myRectangle = new RectangleW { Height = 2, Width = 3 };
            Assert.AreEqual(6, AreaCalculatorW.CalculateArea(myRectangle));
        }
       
        [TestMethod]
        public void NineFor3X3Square()
        {
            var mySquare = new SquareW() { Height = 3 };
            Assert.AreEqual(9, AreaCalculatorW.CalculateArea(mySquare));
        }

        //LD I expect this test to fail
        [TestMethod]
        public void TwentyFor4X5RectangleFromSquare()
        {
            RectangleW newRectangle = new SquareW();
            newRectangle.Width = 4;
            newRectangle.Height = 5;
            Assert.AreEqual(20, AreaCalculatorW.CalculateArea(newRectangle));
        }
    }
}
