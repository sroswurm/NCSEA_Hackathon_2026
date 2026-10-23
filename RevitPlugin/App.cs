using System.Reflection;
using Autodesk.Revit.UI;

namespace NcseaHackathon
{
    public class App : IExternalApplication
    {
        public Result OnStartup(UIControlledApplication application)
        {
            CreateRibbonPanel(application);
            return Result.Succeeded;
        }

        private void CreateRibbonPanel(UIControlledApplication application)
        {
            var panel = application.CreateRibbonPanel("NCSEA Hackathon");
            var assemblyPath = Assembly.GetExecutingAssembly().Location;

            var buttonData = new PushButtonData(
                "HelloWorld",
                "Hello\nWorld",
                assemblyPath,
                "NcseaHackathon.Commands.HelloWorldCommand");

            panel.AddItem(buttonData);
        }

        public Result OnShutdown(UIControlledApplication application)
        {
            return Result.Succeeded;
        }
    }
}
