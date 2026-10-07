using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Brochure.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var billeder = new[]
            {
                new {filnavn = "bg_1", billedetekst = "Oplev arbejdsfitness!"},
                new {filnavn = "bg_2", billedetekst = "Brug din krop med mening!"},
                new {filnavn = "bg_3", billedetekst = "Indtag naturens hotel"},
                new {filnavn = "bg_4", billedetekst = "Lær rytmen i samarbejdet med hinanden"},
                new {filnavn = "bg_5", billedetekst = "Se dum ud mens du laver noget meningsløst"}
            };
            return View(billeder);
        }

        public ActionResult About()
        {
            

            return View();
        }

        public ActionResult BlogSingle()
        {
           

            return View();
        }


        public ActionResult Blog()
        {


            return View();
        }


        public ActionResult Classes()
        {


            return View();
        }


        public ActionResult Contact()
        {


            return View();
        }

        public ActionResult Timetable()
        {


            return View();
        }

        public ActionResult Trainer()
        {


            return View();
        }
    }
}