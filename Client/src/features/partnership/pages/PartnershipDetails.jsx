import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Building2, Clock } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import StatusBadge from '../components/StatusBadge';
import { samplePartners } from '../data/sampleData';


const PartnershipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const partner = samplePartners.find(p => p.id === parseInt(id));

    if (!partner) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-1 bg-gray-50 py-8 px-4 md:px-8">
                    <div className="container mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Partnership not found</h2>
                        <Link
                            to="/partnership"
                            className="mt-4 inline-flex items-center text-[#004165] hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 bg-gray-50 py-8 px-4 md:px-8">
                <div className="container mx-auto">
                    <Link
                        to="/partnership"
                        className="mt-4 inline-flex items-center text-[#004165] hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
                                    <div className="mt-2">
                                        <StatusBadge status={partner.status} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Partnership Type</p>
                                            <p className="font-medium">{partner.type}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium">{partner.duration}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Lead Contact</p>
                                            <p className="font-medium">{partner.contact}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Partnership Start</p>
                                            <p className="font-medium">January 1, 2024</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Partnership Description</h3>
                                    <p className="text-gray-600">
                                        This partnership focuses on {partner.type.toLowerCase()} initiatives,
                                        bringing together expertise and resources to achieve shared goals.
                                        The collaboration spans {partner.duration}, during which both parties
                                        work closely to deliver meaningful impact in their respective fields.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PartnershipDetail;