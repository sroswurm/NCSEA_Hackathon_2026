import comtypes.client
import sys


def connect_to_etabs():
    """Attach to a running ETABS instance and return the SapModel object."""
    helper = comtypes.client.CreateObject("ETABSv1.Helper")
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)

    etabs_object = helper.GetObject("CSI.ETABS.API.ETABSObject")
    sap_model = etabs_object.SapModel

    return etabs_object, sap_model


def main():
    etabs_object, sap_model = connect_to_etabs()

    # Print basic model info
    file_name = sap_model.GetModelFilename()
    print(f"Connected to ETABS!")
    print(f"Model file: {file_name}")

    # Get units
    units = sap_model.GetPresentUnits()
    print(f"Current units: {units}")

    # Get number of stories
    ret = sap_model.Story.GetStories()
    num_stories = ret[0]
    story_names = ret[1]
    print(f"Number of stories: {num_stories}")
    for name in story_names:
        print(f"  - {name}")


if __name__ == "__main__":
    main()
