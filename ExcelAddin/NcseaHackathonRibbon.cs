using Microsoft.Office.Tools.Ribbon;
using System;
using System.Windows.Forms;
using Excel = Microsoft.Office.Interop.Excel;

namespace NcseaHackathon.ExcelAddin
{
    public partial class NcseaHackathonRibbon
    {
        private void NcseaHackathonRibbon_Load(object sender, RibbonUIEventArgs e)
        {
        }

        private void HelloWorld_Click(object sender, RibbonControlEventArgs e)
        {
            MessageBox.Show("Hello from the NCSEA Hackathon Excel Add-In!",
                "NCSEA Hackathon 2026",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
    }
}
