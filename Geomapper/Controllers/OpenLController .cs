﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Geomapper.Controllers
{
    public class OpenLController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    
    }
}