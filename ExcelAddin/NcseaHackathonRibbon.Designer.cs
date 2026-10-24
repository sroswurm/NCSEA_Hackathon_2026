namespace NcseaHackathon.ExcelAddin
{
    partial class NcseaHackathonRibbon : Microsoft.Office.Tools.Ribbon.RibbonBase
    {
        private System.ComponentModel.IContainer components = null;

        public NcseaHackathonRibbon()
            : base(Globals.Factory.GetRibbonFactory())
        {
            InitializeComponent();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        private void InitializeComponent()
        {
            this.tab1 = this.Factory.CreateRibbonTab();
            this.NcseaHackathonGroup = this.Factory.CreateRibbonGroup();
            this.HelloWorld = this.Factory.CreateRibbonButton();
            this.tab1.SuspendLayout();
            this.NcseaHackathonGroup.SuspendLayout();
            this.SuspendLayout();
            //
            // tab1
            //
            this.tab1.ControlId.ControlIdType = Microsoft.Office.Tools.Ribbon.RibbonControlIdType.Office;
            this.tab1.Groups.Add(this.NcseaHackathonGroup);
            this.tab1.Label = "TabAddIns";
            this.tab1.Name = "tab1";
            //
            // NcseaHackathonGroup
            //
            this.NcseaHackathonGroup.Items.Add(this.HelloWorld);
            this.NcseaHackathonGroup.Label = "NCSEA Hackathon";
            this.NcseaHackathonGroup.Name = "NcseaHackathonGroup";
            //
            // HelloWorld
            //
            this.HelloWorld.Label = "Hello World";
            this.HelloWorld.Name = "HelloWorld";
            this.HelloWorld.Click += new Microsoft.Office.Tools.Ribbon.RibbonControlEventHandler(this.HelloWorld_Click);
            //
            // NcseaHackathonRibbon
            //
            this.Name = "NcseaHackathonRibbon";
            this.RibbonType = "Microsoft.Excel.Workbook";
            this.Tabs.Add(this.tab1);
            this.Load += new Microsoft.Office.Tools.Ribbon.RibbonUIEventHandler(this.NcseaHackathonRibbon_Load);
            this.tab1.ResumeLayout(false);
            this.tab1.PerformLayout();
            this.NcseaHackathonGroup.ResumeLayout(false);
            this.NcseaHackathonGroup.PerformLayout();
            this.ResumeLayout(false);
        }

        #endregion

        internal Microsoft.Office.Tools.Ribbon.RibbonTab tab1;
        internal Microsoft.Office.Tools.Ribbon.RibbonGroup NcseaHackathonGroup;
        internal Microsoft.Office.Tools.Ribbon.RibbonButton HelloWorld;
    }

    partial class ThisRibbonCollection
    {
        internal NcseaHackathonRibbon NcseaHackathonRibbon
        {
            get { return this.GetRibbon<NcseaHackathonRibbon>(); }
        }
    }
}
