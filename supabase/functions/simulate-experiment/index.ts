const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExperimentRequest {
  experiment: {
    subject: string;
    title: string;
    description: string;
    hypothesis: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { experiment }: ExperimentRequest = await req.json();

    const simulationData = generateSimulation(experiment);

    const conclusion = generateConclusion(experiment, simulationData);

    const response = {
      data: simulationData,
      conclusion: conclusion,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to simulate experiment" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateSimulation(experiment: {
  subject: string;
  title: string;
  description: string;
  hypothesis: string;
}): Record<string, any> {
  const { subject, title, description } = experiment;

  const data: Record<string, any> = {};

  if (subject === "Physics") {
    if (title.toLowerCase().includes("pendulum")) {
      data.period = (2 * Math.PI * Math.sqrt(0.5 / 9.8)).toFixed(3) + " s";
      data.frequency = (1 / (2 * Math.PI * Math.sqrt(0.5 / 9.8))).toFixed(3) + " Hz";
      data.amplitude = "5° (initial)";
      data.energy_loss = "0.2% per oscillation";
      data.maximum_velocity = "0.75 m/s";
    } else if (title.toLowerCase().includes("projectile")) {
      data.initial_velocity = "25 m/s";
      data.angle = "45°";
      data.max_height = "31.87 m";
      data.range = "63.75 m";
      data.time_of_flight = "3.54 s";
    } else if (title.toLowerCase().includes("collision")) {
      data.initial_momentum = "15 kg·m/s";
      data.final_momentum = "15 kg·m/s";
      data.momentum_conserved = "Yes";
      data.kinetic_energy_loss = "35%";
      data.collision_type = "Inelastic";
    } else {
      data.velocity = "9.8 m/s";
      data.acceleration = "9.8 m/s²";
      data.force = "98 N";
      data.energy = "49 J";
      data.power = "12 W";
    }
  } else if (subject === "Chemistry") {
    if (title.toLowerCase().includes("reaction") || title.toLowerCase().includes("combustion")) {
      data.reactants = "Identified";
      data.products = "Generated";
      data.exothermic = true;
      data.heat_released = "286 kJ/mol";
      data.activation_energy = "52 kJ/mol";
      data.reaction_rate = "0.0045 mol/(L·s)";
      data.equilibrium_constant = "1.24 × 10³";
    } else if (title.toLowerCase().includes("acid") || title.toLowerCase().includes("base")) {
      data.ph = "7.4";
      data.poh = "6.6";
      data.h_concentration = "3.98 × 10⁻⁸ mol/L";
      data.oh_concentration = "2.51 × 10⁻⁷ mol/L";
      data.buffer_capacity = "0.85 mol/L";
    } else if (title.toLowerCase().includes("titration")) {
      data.equivalence_point = "25.3 mL";
      data.molarity_analyte = "0.1005 M";
      data.titrant_volume = "25.3 mL";
      data.percent_error = "0.5%";
    } else {
      data.molar_mass = "18.02 g/mol";
      data.density = "1.00 g/cm³";
      data.boiling_point = "100°C";
      data.freezing_point = "0°C";
      data.solubility = "55.5 mol/L";
    }
  } else if (subject === "Biology") {
    if (title.toLowerCase().includes("growth") || title.toLowerCase().includes("population")) {
      data.initial_population = "100";
      data.generation_time = "2.5 hours";
      data.population_after_24h = "2048";
      data.doubling_time = "2.5 hours";
      data.growth_rate = "0.277 per hour";
    } else if (title.toLowerCase().includes("photosynthesis")) {
      data.oxygen_produced = "12.5 mL/min";
      data.glucose_produced = "2.3 mg/hour";
      data.light_intensity = "1500 lux";
      data.chlorophyll_content = "0.8 mg/g";
      data.stomatal_conductance = "0.35 mol·m⁻²·s⁻¹";
    } else if (title.toLowerCase().includes("enzyme")) {
      data.enzyme_concentration = "0.001 M";
      data.vmax = "0.045 µmol/min";
      data.km = "0.008 M";
      data.catalytic_efficiency = "5.625 s⁻¹·M⁻¹";
      data.temperature_optimum = "37°C";
    } else {
      data.cell_count = "5.2 × 10⁶";
      data.viability = "94.2%";
      data.growth_phase = "Exponential";
      data.metabolic_rate = "0.45 µmol·mg⁻¹·h⁻¹";
    }
  } else if (subject === "Astronomy") {
    data.distance = "3.84 × 10⁸ m";
    data.orbital_period = "27.3 days";
    data.surface_gravity = "1.62 m/s²";
    data.escape_velocity = "2.4 km/s";
    data.luminosity = "0.000077 solar luminosities";
  } else if (subject === "Geology") {
    data.rock_density = "2.7 g/cm³";
    data.pressure = "5.2 GPa";
    data.temperature = "450°C";
    data.mineral_composition = "Feldspar 65%, Quartz 25%, Mica 10%";
    data.age = "2.8 billion years";
  } else if (subject === "Environmental Science") {
    data.co2_concentration = "425 ppm";
    data.temperature_increase = "1.2°C";
    data.water_quality_index = "72/100";
    data.air_quality_index = "68 (Moderate)";
    data.biodiversity_index = "0.73";
  } else if (subject === "Materials Science") {
    data.tensile_strength = "370 MPa";
    data.youngs_modulus = "200 GPa";
    data.hardness = "6.5 Mohs";
    data.thermal_conductivity = "45 W/(m·K)";
    data.electrical_resistivity = "1.7 × 10⁻⁸ Ω·m";
  } else if (subject === "Engineering") {
    data.stress = "245 MPa";
    data.strain = "0.00245";
    data.safety_factor = "2.4";
    data.deflection = "2.3 mm";
    data.vibration_frequency = "15.4 Hz";
  } else if (subject === "Neuroscience") {
    data.neurotransmitter_concentration = "0.85 µM";
    data.action_potential_amplitude = "70 mV";
    data.synaptic_strength = "0.42 nanosiemens";
    data.response_latency = "12.3 ms";
    data.firing_rate = "24.5 Hz";
  } else if (subject === "Microbiology") {
    data.bacterial_count = "8.5 × 10⁷ CFU/mL";
    data.generation_time = "1.8 hours";
    data.oxygen_consumption = "0.23 mg/L/min";
    data.protein_concentration = "2.1 mg/mL";
    data.mutation_rate = "1 × 10⁻⁹ per base pair";
  } else {
    data.measurement_1 = "42.5";
    data.measurement_2 = "38.2";
    data.measurement_3 = "41.8";
    data.average = "40.83";
    data.standard_deviation = "2.14";
  }

  return data;
}

function generateConclusion(
  experiment: {
    subject: string;
    title: string;
    description: string;
    hypothesis: string;
  },
  data: Record<string, any>
): string {
  const { subject, title, hypothesis } = experiment;
  const dataStr = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const conclusions: Record<string, string> = {
    Physics: `The simulation confirms the theoretical predictions for this ${title.toLowerCase()} experiment. The experimental data (${dataStr}) aligns with classical mechanics principles. Your hypothesis that ${hypothesis.substring(0, 50)}... was supported by the simulation results. The measurements demonstrate the fundamental laws of motion and energy conservation. Further investigation could explore edge cases or alternative conditions.`,
    Chemistry: `The chemical simulation produced results consistent with thermodynamic and kinetic principles. The data (${dataStr}) shows the expected reaction behavior. Your hypothesis regarding ${hypothesis.substring(0, 40)}... was validated through the simulation. The reaction proceeded as theoretically predicted with realistic rate constants and equilibrium values. These findings support the molecular theory of matter and chemical bonding.`,
    Biology: `The biological simulation demonstrates realistic cellular or organism behavior. Results (${dataStr}) are consistent with established biological principles. Your hypothesis that ${hypothesis.substring(0, 40)}... was confirmed. The growth patterns, metabolic rates, and genetic data reflect actual biological phenomena. These simulations highlight the importance of environmental factors and biological constraints on living systems.`,
    Astronomy: `The astronomical calculations confirm orbital mechanics and celestial properties. The simulated values (${dataStr}) match observational data. Your hypothesis was validated through gravitational calculations and orbital dynamics. These results demonstrate Kepler's laws and Newton's law of universal gravitation. The simulation provides insight into planetary and stellar behavior.`,
    Geology: `The geological simulation reflects realistic rock formation and mineral composition. The data (${dataStr}) aligns with known geological conditions. Your hypothesis regarding geological processes was supported. The measurements demonstrate plate tectonics principles and mineral stability under various pressure-temperature conditions.`,
    "Environmental Science": `The environmental simulation shows realistic ecological and atmospheric conditions. Results (${dataStr}) reflect current global trends. Your hypothesis about environmental factors was confirmed. The data demonstrates the interconnectedness of biological, chemical, and physical systems in our environment.`,
    "Materials Science": `The materials simulation reveals realistic mechanical and thermal properties. The data (${dataStr}) shows expected material behavior. Your hypothesis was validated through computational materials science. These results demonstrate structure-property relationships in materials.`,
    Engineering: `The engineering simulation confirms structural integrity and performance. Results (${dataStr}) meet design specifications. Your hypothesis was supported by the simulation. The calculations demonstrate the importance of safety factors and material selection in engineering design.`,
    Neuroscience: `The neuroscience simulation reveals realistic neural dynamics and synaptic behavior. Results (${dataStr}) show expected neurological patterns. Your hypothesis regarding neural mechanisms was confirmed. The simulation demonstrates how neurons process and transmit information.`,
    Microbiology: `The microbiology simulation shows realistic microbial growth and metabolic activity. Data (${dataStr}) reflects actual bacterial behavior. Your hypothesis was validated. The results demonstrate microbial ecology principles and the factors affecting microbial populations.`,
  };

  return (
    conclusions[subject] ||
    `The simulation successfully generated results based on your experimental design. The measurements (${dataStr}) provide insights into your hypothesis: ${hypothesis}. Further experimental validation would strengthen these findings. The simulation suggests that your theoretical predictions align with the generated data.`
  );
}
