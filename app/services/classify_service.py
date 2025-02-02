import os
from transformers import pipeline
from app.utils.file_handler import save_temp_image
from PIL import Image
import google.generativeai as genai

# Initialize the Hugging Face model
classifier = pipeline("image-classification", model="microsoft/swin-tiny-patch4-window7-224")

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCRJWPgakOG1RMCU7m9Q3UvnRuhBn9LyCA"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def get_waste_type(label: str) -> str:
    """Map the model's label to specific waste type using Gemini"""
    prompt = f"""
    Based on the image classification label '{label}', identify the exact waste material type.
    Consider common materials like:
    - It will be "Plastic" if '{label}' contain any words between the bracket (Plastic Bottle, Plastic Bag, Plastic Container, Plastic Straw, Plastic Cutlery, Plastic Cups, Plastic Plates, Plastic Wrap, Plastic Lids, Plastic Packaging, Plastic Trays, Plastic Spoons, Plastic Forks, Plastic Jugs, Plastic Tubes, Plastic Caps, Plastic Tumblers, Plastic Bags for Groceries, Plastic Food Storage Containers, Plastic Brushes..)
    - It will be "Paper/Cardboard" if '{label}' contain any words between the bracket(Cardboard Boxes, Paper Bags, Newspaper, Office Paper, Tissue Paper, Paper Towels, Toilet Paper, Paper Plates, Paper Cups, Paper Napkins, Paper Wrapping, Paper Cartons, Egg Cartons, Cardboard Tubes, Paper Envelopes, Cardboard Packaging, Paperboard, Food Packaging Boxes, Post-it Notes, Catalogs, Magazine Covers.)
    - It will be "Metal" if '{label}' contain any words between the bracket (Drink Cans, Aluminum Bottles, Tin Foil, Aluminum Trays, Steel Containers, Metal Lids, Metal Straws, Metal Utensils, Canned Food Cans, Tin Cans, Beverage Bottles, Metal Buckets, Aluminum Foil Pans, Steel Pipes, Metal Jars, Copper Wire, Iron Sheets, Steel Scrap, Aluminum Panels, Metal Paint Cans.)
    - It will be "Glass" if '{label}' contain any words between the bracket(Glass Bottles, Glass Jars, Glass Containers, Broken Glassware, Laboratory Glassware (e.g., beakers, test tubes), Glass Syringes, Glass Vials, Glass Slides, Glass Ampoules, Glass Medicine Bottles, Broken Glass from Medical Equipment, Glass Windows, Glass Containers for Chemicals, Glass Carboys, Glass Thermometers, Glass Pipettes, Glass Microscopes, Glass Filters, Glass Bulbs, Glass Frames.)
    - It will be "Organic Waste" if '{label}' contain any words between the bracket(Fruit and vegetable peels, Coffee grounds, Eggshells, Grass clippings, Leaves, Yard trimmings, Plant cuttings, Tree branches, Food scraps, Tea bags, Cereal, Rice, Bread, Meat bones, Dairy products, Fish scraps, Nutshells, Flower petals, Shrubs, Weeds, Paper towels)
    - It will be "Electronic waste" if '{label}' contain any words between the bracket(Old Computers, Broken Monitors, Television Sets, Mobile Phones, Laptops, Keyboards, Mice, Circuit Boards, Cables and Wires, Printers, Scanners, Fax Machines, Digital Cameras, Batteries, Power Adapters, Medical Imaging Devices, Thermometers, X-ray Machines, GPS Devices, Audio Systems, Electrical Appliances.)
    - It will be "Medical waste" if '{label}' contain any words between the bracket (Syringe, Needle, Glove, Scalpel, Bandages and Dressings, Surgical Masks, Blood-soaked Cotton Swabs, Infusion Bags and Tubing, Used Catheters, Intravenous (IV) Drip Sets, Cotton Balls, Used Gauze, Used Surgical Drapes, Test Tubes, Blood and Bodily Fluids, Used Thermometers, Dialysis Waste, Implants, Used Ostomy Bags, Bottles of Expired Medications)
    - It will be "Battery" if '{label}' contain any words between the bracket (Pencil Battery, Button Cell Battery, AA Battery, AAA Battery, C Battery, D Battery, 9V Battery, Lead-Acid Battery, Lithium-Ion Battery, Lithium-Polymer Battery, Mobile Phone Battery, Laptop Battery, Car Battery, NiMH (Nickel-Metal Hydride) Battery, NiCd (Nickel-Cadmium) Battery, Solar Battery, Rechargeable Battery, Zinc-Carbon Battery, Alkaline Battery, Coin Cell Battery.)
    - It will be "Wood Waste" if '{label}' contains any words between the bracket (Wooden Furniture, Wooden Pallets, Wooden Boards, Wooden Logs, Tree Stumps, Sawdust, Wooden Packaging, Wooden Planks, Wood Shavings, Wood Chips, Tree Branches, Wooden Structures, Wooden Boxes, Plywood.)
    - It will be "Textile Waste" if '{label}' contains any words between the bracket (Clothing, Shoes, Fabric, Upholstery, Curtains, Carpet, Towels, Bed Sheets, Pillowcases, Blankets, Wool, Leather Goods, Textile Scraps, Rags, T-shirts, Socks, Denim, Woolen Sweaters, Handbags.)
    - It will be "Rubber Waste" if '{label}' contains any words between the bracket (Tires, Rubber Bands, Rubber Gloves, Rubber Balls, Rubber Bands, Rubber Mats, Rubber Flooring, Rubber Seals, Rubber Gaskets, Rubber Hoses, Rubber Belts, Rubber Shoes, Rubber Toys, Rubber Mulch, Rubber Roofing, Rubber Insulation, Rubberized Fabrics, Rubberized Coatings, Rubberized Textiles.)
    - It will be "Plastic Waste" if '{label}' contains any words between the bracket (Plastic Bottles, Plastic Cups, Plastic Trays, Plastic Jugs, Plastic Buckets, Plastic Bags, Plastic Packaging, Plastic Tubes, Plastic Caps, Plastic Tumblers, Plastic Spoons, Plastic Forks, Plastic Lids, Plastic Straws, Plastic Cutlery, Plastic Food
    - It will be "Construction and Demolition Waste" if '{label}' contains any words between the bracket (Concrete, Bricks, Tiles, Cement Bags, Wood Scraps, Drywall, Plasterboard, Roofing Materials, Glass Windows, Doors, Metals from Construction, Asphalt, Stones, Gravel, Nails, Screws, Insulation Materials, Paint Cans.)
    - It will be "Agricultural Waste" if '{label}' contains any words between the bracket (Crop Residue, Pesticides, Fertilizers, Plant Trimmings, Livestock Manure, Animal Feed Waste, Organic Waste from Farms, Harvested Plants, Agricultural Plastic, Agricultural Packaging, Dead Plants, Fruit Waste, Agricultural Chemicals.)


    
    Return ONLY the specific waste material type in a single line, no explanation.
    Example outputs:
    "PET Plastic"
    "Corrugated Cardboard"
    "Aluminum Can"
    """
    
    try:
        response = model.generate_content(prompt)
        waste_type = response.text.strip()
        return waste_type
    except Exception as e:
        return f"Unidentified Waste: {str(e)}"

def get_gemini_response(waste_type: str) -> str:
    """Get detailed information about waste disposal from Gemini"""
    prompt = f"""
    Based on the identified waste type '{waste_type}', provide a detailed waste management response covering:
    1. What SDG goal is being addressed by the waste
    2. What type of waste this specifically represents (material properties)
    3. How it affects soil, water, and air if improperly disposed of
    4. How it can be harmful to humans and animals
    5. What are the best methods for safe disposal or recycling?
    Please provide specific details about proper handling and disposal methods.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Unable to generate detailed analysis: {str(e)}"

def process_classification_results(label: str, score: float) -> dict:
    """Process the model's classification label into detailed waste information"""
    # Get specific waste type using Gemini
    specific_waste_type = get_waste_type(label)
    
    return {
        "type": specific_waste_type,  # Use the specific waste type identified by Gemini
        "original_label": label,  # Keep the original classification for reference
        "confidence_score": score,
        "description": f"Identified waste type: {specific_waste_type} (based on {label})",
        "recyclable": None,  # This will be determined by Gemini's analysis
    }

def classify_image(uploaded_file):
    """Classify waste from an uploaded image with specific material identification"""
    try:
        # Save and load the image
        image_path = save_temp_image(uploaded_file)
        image = Image.open(image_path)
        
        # Get classification results from the Swin Transformer model
        results = classifier(image)
        
        # Store all classification details
        all_predictions = [{"label": r["label"], "score": r["score"]} for r in results]
        
        # Process the top prediction (highest confidence score)
        if results and results[0]["score"] >= 0.10:  # Minimum confidence threshold
            top_prediction = results[0]
            
            # Process the classification result with specific waste type identification
            waste_details = process_classification_results(
                top_prediction["label"],
                top_prediction["score"]
            )
            
            # Get detailed analysis using the specific waste type
            gemini_insights = get_gemini_response(waste_details["type"])
            waste_details["waste_analysis"] = gemini_insights
            
        else:
            waste_details = {
                "type": "Unidentified",
                "original_label": None,
                "confidence_score": 0,
                "description": "Could not confidently classify the image.",
                "recyclable": None,
                "waste_analysis": "Unable to provide detailed analysis due to low confidence classification."
            }
        
        # Cleanup temporary files
        cleanup_temp_files(image_path)
        
        return waste_details, all_predictions
        
    except Exception as e:
        error_response = {
            "type": "Error",
            "original_label": None,
            "confidence_score": 0,
            "description": f"Error during classification: {str(e)}",
            "recyclable": None,
            "waste_analysis": "An error occurred during the analysis process."
        }
        return error_response, []

def cleanup_temp_files(image_path):
    """Clean up temporary files after processing"""
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print(f"Error cleaning up temporary files: {str(e)}")